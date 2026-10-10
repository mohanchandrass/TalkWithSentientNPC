import io
import wave
import json
import asyncio
import vosk

class STTService:
    def __init__(self, vosk_model):
        self.model = vosk_model

    async def transcribe_audio(self, audio_bytes: bytes) -> str:
        # Validate WAV structure and extract PCM data
        try:
            with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
                if wf.getnchannels() != 1:
                    raise ValueError("Audio must be mono")
                if wf.getsampwidth() != 2:
                    raise ValueError("Audio must be 16-bit PCM")
                if wf.getframerate() != 16000:
                    raise ValueError("Audio must be 16000 Hz")
                
                pcm_data = wf.readframes(wf.getnframes())
        except wave.Error as e:
            raise ValueError(f"Invalid WAV file format: {e}")
        except Exception as e:
            raise ValueError(f"Error reading audio data: {e}")

        if not pcm_data:
            return ""

        # Run Vosk recognition in a thread pool to avoid blocking the async event loop
        loop = asyncio.get_running_loop()
        
        def run_vosk():
            # KaldiRecognizer is created fresh for each request, using the shared model
            rec = vosk.KaldiRecognizer(self.model, 16000)
            rec.AcceptWaveform(pcm_data)
            result = json.loads(rec.FinalResult())
            return result.get("text", "")

        text = await loop.run_in_executor(None, run_vosk)
        return text
