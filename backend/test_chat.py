import requests
import time
import sys
import os

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    print("Testing /api/health...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        response.raise_for_status()
        data = response.json()
        print(f"Health Status: {data['status']}")
        if data['status'] != "ok":
            print(f"Warning: System not fully loaded: {data}")
            return False
        return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat(message):
    print(f"\n--- Testing Chat ---")
    print(f"Message: {message}")
    
    start = time.time()
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json={"message": message})
        response.raise_for_status()
        data = response.json()
        
        req_time = int((time.time() - start) * 1000)
        
        print(f"Response Text: {data['text']}")
        print(f"Audio URL: {data['audio_url']}")
        
        if 'timings' in data:
            print(f"Timings: Inference {data['timings']['inference_ms']}ms, TTS {data['timings']['tts_ms']}ms, Total {data['timings']['total_ms']}ms")
        else:
            print(f"Total Request Time: {req_time}ms")
            
        # Test Audio URL
        audio_url = f"{BASE_URL}{data['audio_url']}"
        print(f"Fetching audio from {audio_url}...")
        audio_resp = requests.get(audio_url)
        if audio_resp.status_code == 200:
            print(f"Audio retrieved successfully! Size: {len(audio_resp.content)} bytes")
        else:
            print(f"Failed to retrieve audio. Status: {audio_resp.status_code}")
            
    except Exception as e:
        print(f"Chat request failed: {e}")

if __name__ == "__main__":
    if not test_health():
        print("Backend is not ready or not running. Exiting tests.")
        sys.exit(1)
        
    messages = [
        "Hello",
        "Who are you?",
        "Tell me about this place.",
        "What can you tell me?"
    ]
    
    for msg in messages:
        test_chat(msg)
        time.sleep(1) # Small delay between requests
