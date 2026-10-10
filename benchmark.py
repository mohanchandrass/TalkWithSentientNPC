import time
import os
import torch
import numpy as np

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow.keras.models import load_model

print("Starting benchmark...")
start_time = time.time()

# 1. Load Transformer
print("Loading Transformer...")
model_path = "chatbot_model_skyrim.keras"
if not os.path.exists(model_path):
    print("Error: Transformer model not found.")
    exit(1)

model = load_model(model_path)
with open("vocab.txt", "r") as f:
    vocab = f.read().splitlines()
with open("responses.txt", "r") as f:
    responses = f.read().splitlines()

# 2. Load TTS
print("Loading TTS...")
device = torch.device('cpu')
local_file = 'model.pt'
if not os.path.isfile(local_file):
    torch.hub.download_url_to_file('https://models.silero.ai/models/tts/en/v3_en.pt', local_file)
tts_model = torch.PackageImporter(local_file).load_pickle("tts_models", "model")
tts_model.to(device)

print(f"Loading time: {time.time() - start_time:.2f}s")

# Benchmarking
input_text = "hello bartender"

# Transformer Profiling
t0 = time.time()
# Tokenization (naive)
input_tokens = [vocab.index(w) if w in vocab else 0 for w in input_text.split()]
input_seq = tf.keras.preprocessing.sequence.pad_sequences([input_tokens], maxlen=20, padding='post')
t_tok = time.time() - t0

t1 = time.time()
# Decoder profiling (greedy)
# Wait, the Keras model predicts the response index directly in this architecture (it's a classifier in the original Sentient_NPC repo).
pred = model.predict(input_seq, verbose=0)
t_pred = time.time() - t1
resp_idx = np.argmax(pred)
response_text = responses[resp_idx] if resp_idx < len(responses) else "i don't know."

print(f"\n--- Transformer ---")
print(f"Tokenization: {t_tok*1000:.2f}ms")
print(f"Inference (Classification): {t_pred*1000:.2f}ms")
print(f"Total: {(t_tok+t_pred)*1000:.2f}ms")
print(f"Response: {response_text}")

# TTS Profiling
t0 = time.time()
# Preprocessing
sample_rate = 16000
speaker = 'en_0'
t_pre = time.time() - t0

t1 = time.time()
audio = tts_model.apply_tts(text=response_text, speaker=speaker, sample_rate=sample_rate)
t_tts = time.time() - t1

t2 = time.time()
# Convert to Int16 PCM
audio_np = audio.numpy()
audio_np = np.int16(audio_np * 32767)
t_conv = time.time() - t2

print(f"\n--- TTS ---")
print(f"Pre: {t_pre*1000:.2f}ms")
print(f"Apply_tts: {t_tts*1000:.2f}ms")
print(f"Conv: {t_conv*1000:.2f}ms")
print(f"Total: {(t_pre+t_tts+t_conv)*1000:.2f}ms")

print("\nBenchmark Complete.")
