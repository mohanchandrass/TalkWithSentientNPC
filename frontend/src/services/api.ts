export interface ChatResponse {
  text: string;
  audio_url: string;
  timings?: {
    inference_ms: number;
    tts_ms: number;
    total_ms: number;
  };
}

const BASE_URL = 'http://127.0.0.1:8000';

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Ensure the audio URL is absolute pointing to the backend
    if (data.audio_url && data.audio_url.startsWith('/')) {
      data.audio_url = `${BASE_URL}${data.audio_url}`;
    }
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
};
