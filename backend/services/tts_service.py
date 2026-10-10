import os
import uuid
import time
import numpy as np
import scipy.io.wavfile as wavfile
import asyncio

class TTSService:
    def __init__(self, model, output_dir):
        self.tts_model = model
        self.output_dir = output_dir
        self.tts_sample_rate = 48000
        self._lock = asyncio.Lock()
        os.makedirs(self.output_dir, exist_ok=True)
        
    async def synthesize_and_save(self, text: str) -> dict:
        async with self._lock:
            start_time = time.time()
            try:
                # Silero TTS inference (CPU bound, so ideally run in thread)
                audio = await asyncio.to_thread(
                    self.tts_model.apply_tts,
                    text=text,
                    speaker="en_1",
                    sample_rate=self.tts_sample_rate
                )
                
                audio_numpy = np.array(audio, dtype=np.float32)
                filename = f"{uuid.uuid4().hex}.wav"
                filepath = os.path.join(self.output_dir, filename)
                
                # Write audio
                await asyncio.to_thread(wavfile.write, filepath, self.tts_sample_rate, audio_numpy)
                
                tts_ms = int((time.time() - start_time) * 1000)
                
                return {
                    "filename": filename,
                    "tts_ms": tts_ms
                }
            except Exception as e:
                print(f"TTS Service Error: {e}")
                raise e
