import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function test() {
  console.log("Testing /api/health...");
  try {
    const res = await fetch("http://127.0.0.1:8000/api/health");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("Health OK:", await res.json());
  } catch (e) {
    console.log("Health check failed:", e.message);
    return;
  }

  console.log("\nTesting /api/transcribe with synthetic WAV...");
  try {
    // Generate 1 second of silence
    const samples = new Float32Array(16000); // 1 sec at 16kHz
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 16000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      view.setInt16(offset, 0, true); // silence
    }
    
    const wavBuffer = Buffer.from(buffer);
    
    const form = new FormData();
    form.append('audio', wavBuffer, { filename: 'test.wav', contentType: 'audio/wav' });
    
    const res = await fetch("http://127.0.0.1:8000/api/transcribe", {
      method: 'POST',
      body: form
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("Transcription successful!");
    console.log("Response:", data);
  } catch(e) {
    console.log("STT test failed:", e.message);
  }
}

test();
