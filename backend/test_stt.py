import wave
import struct
import io
import requests

def create_synthetic_wav() -> bytes:
    """Creates a valid 16kHz Mono 16-bit PCM WAV in memory for testing."""
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(16000)
        # Write a split second of silence
        for _ in range(1600):
            wf.writeframesraw(struct.pack('<h', 0))
    return buf.getvalue()

def test_stt():
    print("Testing /api/health...")
    try:
        health_res = requests.get("http://127.0.0.1:8000/api/health")
        health_res.raise_for_status()
        print("Health OK:", health_res.json())
    except Exception as e:
        print(f"Health check failed: {e}")
        return

    print("\nTesting /api/transcribe with synthetic WAV...")
    wav_bytes = create_synthetic_wav()
    
    try:
        files = {'audio': ('test.wav', wav_bytes, 'audio/wav')}
        res = requests.post("http://127.0.0.1:8000/api/transcribe", files=files)
        res.raise_for_status()
        
        data = res.json()
        print("Transcription successful!")
        print("Response:", data)
        
        assert "text" in data
        assert "timings" in data
        assert "stt_ms" in data["timings"]
    except Exception as e:
        print(f"STT test failed: {e}")
        if 'res' in locals() and hasattr(res, 'text'):
            print("Response:", res.text)

if __name__ == "__main__":
    test_stt()
