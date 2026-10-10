import os
import ssl
import pickle
import asyncio
import time
from contextlib import asynccontextmanager
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import vosk
import tensorflow as tf
from tensorflow.keras.models import load_model

from transformer_chatbot import PositionalEncoding, DecoderBlock, ExpandMask
from services.chatbot_service import ChatbotService
from services.tts_service import TTSService
from services.stt_service import STTService

try:
    _default_context = ssl._create_default_https_context
    ssl._create_default_https_context = ssl._create_unverified_context
except Exception:
    pass

class AppState:
    vosk_model = None
    tts_model = None
    chatbot_model = None
    vocab_q = None
    vocab_a = None
    stt_loaded = False
    tts_loaded = False
    model_loaded = False
    chatbot_service = None
    tts_service = None
    stt_service = None

state = AppState()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VOSK_MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "vosk-model-small-en-us-0.15")
CHATBOT_MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "chatbot_model_skyrim.keras")
VOCAB_Q_PATH = os.path.join(SCRIPT_DIR, "models", "skyrim_vocab_q.pkl")
VOCAB_A_PATH = os.path.join(SCRIPT_DIR, "models", "skyirm_vocab_a.pkl")
AUDIO_OUTPUT_DIR = os.path.join(SCRIPT_DIR, "audio", "generated")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Cleaning old generated audio...")
    try:
        if os.path.exists(AUDIO_OUTPUT_DIR):
            for filename in os.listdir(AUDIO_OUTPUT_DIR):
                if filename.endswith(".wav"):
                    filepath = os.path.join(AUDIO_OUTPUT_DIR, filename)
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        print(f"Could not remove {filepath}: {e}")
        else:
            os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)
    except Exception as e:
        print(f"[STARTUP] Error cleaning audio: {e}")

    print("[STARTUP] Loading models...")
    
    # Vosk
    try:
        print(f"[STARTUP] Loading Vosk...")
        if os.path.exists(VOSK_MODEL_PATH):
            state.vosk_model = vosk.Model(VOSK_MODEL_PATH)
            state.stt_loaded = True
            print("[STARTUP] Vosk loaded")
    except Exception as e:
        print(f"[STARTUP] Error loading Vosk: {e}")

    # Silero TTS
    try:
        print("[STARTUP] Loading Silero...")
        state.tts_model, _ = await asyncio.to_thread(
            torch.hub.load,
            repo_or_dir="snakers4/silero-models",
            model="silero_tts",
            language="en",
            speaker="v3_en",
            trust_repo=True
        )
        state.tts_loaded = True
        print("[STARTUP] Silero loaded")
    except Exception as e:
        print(f"[STARTUP] Error loading Silero TTS: {e}")

    # Vocabs
    class Vocabulary:
        def __init__(self):
            self._word_to_index = {"<unk>": 0}
            self._index_to_word = {0: "<unk>"}
            self._count = 1
        def add_words(self, tokens):
            for token in tokens:
                if token not in self._word_to_index:
                    self._word_to_index[token] = self._count
                    self._index_to_word[self._count] = token
                    self._count += 1
        def stoi(self, word):
            return self._word_to_index.get(word, 0)
        def itos(self, index):
            return self._index_to_word.get(index, "<unk>")
        def __len__(self):
            return self._count

    import __main__
    __main__.Vocabulary = Vocabulary

    try:
        if os.path.exists(VOCAB_Q_PATH) and os.path.exists(VOCAB_A_PATH):
            with open(VOCAB_Q_PATH, "rb") as f:
                state.vocab_q = pickle.load(f)
            with open(VOCAB_A_PATH, "rb") as f:
                state.vocab_a = pickle.load(f)
    except Exception as e:
        print(f"[STARTUP] Error loading Vocabularies: {e}")

    # Chatbot Model
    try:
        print(f"[STARTUP] Loading Transformer...")
        if os.path.exists(CHATBOT_MODEL_PATH):
            state.chatbot_model = load_model(
                CHATBOT_MODEL_PATH,
                compile=False,
                custom_objects={
                    'PositionalEncoding': PositionalEncoding,
                    'DecoderBlock': DecoderBlock,
                    'ExpandMask': ExpandMask
                }
            )
            state.model_loaded = True
            print("[STARTUP] Transformer loaded")
    except Exception as e:
        print(f"[STARTUP] Error loading Chatbot Model: {e}")

    # Initialize Services
    if state.model_loaded and state.vocab_q and state.vocab_a:
        state.chatbot_service = ChatbotService(state.chatbot_model, state.vocab_q, state.vocab_a)
    if state.tts_loaded:
        state.tts_service = TTSService(state.tts_model, AUDIO_OUTPUT_DIR)
    if state.stt_loaded:
        state.stt_service = STTService(state.vosk_model)

    print("[STARTUP] READY")
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/api/health")
async def health_check():
    status = "ok" if (state.model_loaded and state.stt_loaded and state.tts_loaded) else "degraded"
    return {
        "status": status,
        "model_loaded": state.model_loaded,
        "stt_loaded": state.stt_loaded,
        "tts_loaded": state.tts_loaded,
        "vocab_loaded": state.vocab_q is not None and state.vocab_a is not None
    }

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    if not state.chatbot_service or not state.tts_service:
        raise HTTPException(status_code=503, detail="Services not fully initialized")

    print(f"[CHAT] Received message: {req.message}")
    
    start_time = time.time()
    
    try:
        print("[CHAT] Transformer inference started")
        bot_response = await state.chatbot_service.generate_response(req.message)
        print("[CHAT] Transformer inference completed")
        
        print("[TTS] Generating audio")
        tts_response = await state.tts_service.synthesize_and_save(bot_response["text"])
        print("[TTS] Audio generated")
        
        total_ms = int((time.time() - start_time) * 1000)
        
        audio_url = f"/api/audio/{tts_response['filename']}"
        
        return {
            "text": bot_response["text"],
            "audio_url": audio_url,
            "timings": {
                "inference_ms": bot_response["inference_ms"],
                "tts_ms": tts_response["tts_ms"],
                "total_ms": total_ms
            }
        }
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/transcribe")
async def transcribe_endpoint(audio: UploadFile = File(...)):
    if not state.stt_service:
        raise HTTPException(status_code=503, detail="STT Service is not initialized")
        
    start_time = time.time()
    try:
        audio_bytes = await audio.read()
        
        # Enforce sensible size limit (e.g. 5MB)
        if len(audio_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Audio file too large")
            
        print(f"[STT] Transcribing audio ({len(audio_bytes)} bytes)...")
        text = await state.stt_service.transcribe_audio(audio_bytes)
        print(f"[STT] Transcription complete: '{text}'")
        
        stt_ms = int((time.time() - start_time) * 1000)
        return {
            "text": text,
            "timings": {
                "stt_ms": stt_ms
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error in transcribe endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    filepath = os.path.join(AUDIO_OUTPUT_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Audio file not found")
        
    # Prevent path traversal
    if os.path.abspath(filepath) != os.path.join(os.path.abspath(AUDIO_OUTPUT_DIR), filename):
        raise HTTPException(status_code=403, detail="Forbidden")

    return FileResponse(filepath, media_type="audio/wav")
