import re
import time
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import asyncio

class ChatbotService:
    def __init__(self, model, vocab_q, vocab_a):
        self.chatbot_model = model
        self.vocab_q = vocab_q
        self.vocab_a = vocab_a
        self.MAX_ENCODER_LEN = 7
        self.MAX_DECODER_LEN = 16
        self.START_ID = self.vocab_a.stoi("startseq")
        self.END_ID = self.vocab_a.stoi("endseq")
        self._lock = asyncio.Lock()
        
    async def generate_response(self, user_input: str) -> dict:
        async with self._lock:
            start_time = time.time()
            try:
                user_input = user_input.lower().strip()
                user_input = re.sub(r'[\\/:;\\-_+@&!?$()<>.,@#%^&*\"]', '', user_input)
                input_tokens = [self.vocab_q.stoi(tok) for tok in user_input.split()]
                enc_input = pad_sequences([input_tokens], maxlen=self.MAX_ENCODER_LEN, padding='post')
                enc_input_tf = tf.constant(enc_input, dtype=tf.int32)

                generated = [self.START_ID]

                for _ in range(self.MAX_DECODER_LEN - 1):
                    dec_input = pad_sequences([generated], maxlen=self.MAX_DECODER_LEN, padding='post')
                    dec_input_tf = tf.constant(dec_input, dtype=tf.int32)

                    logits = self.chatbot_model([enc_input_tf, dec_input_tf], training=False)

                    next_logits = logits[:, len(generated) - 1, :]
                    next_id = int(tf.argmax(next_logits, axis=-1, output_type=tf.int32).numpy()[0])

                    if next_id == self.END_ID:
                        break
                    generated.append(next_id)

                response = " ".join([self.vocab_a.itos(tok) for tok in generated[1:]
                                     if tok not in (0, self.START_ID, self.END_ID)])
                
                inference_ms = int((time.time() - start_time) * 1000)
                
                if not response:
                    response = "..."

                return {
                    "text": response,
                    "inference_ms": inference_ms
                }
            except Exception as e:
                print(f"Chatbot Service Error: {e}")
                raise e
