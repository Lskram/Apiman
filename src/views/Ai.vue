// Ai.vue
<template>
  <div class="container chat-container">
    <div class="card shadow-lg p-4">
      <h1 class="mb-4 text-center">
        <span class="robot-icon">🤖</span> AI Huggingface
      </h1>
      
      <div class="chat-messages" ref="messagesContainer">
        <!-- Welcome message -->
        <div class="message ai welcome-message">
          สวัสดีครับ! ผมเป็น AI Huggingface ผู้ช่วยของคุณ 😊
          คุณสามารถถามคำถามหรือพูดคุยกับผมได้เลยครับ
          ฉันโต้ตอบคุณได้เพียงเเค่ภาษาอังกฤษ
        </div>
        
        <div v-for="(message, index) in messages" 
             :key="index" 
             :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="chat-input">
        <input 
          v-model="userInput"
          type="text"
          class="form-control"
          placeholder="พิมพ์ข้อความของคุณ..."
          :disabled="isLoading"
        />
        <button 
          type="submit"
          class="btn btn-primary send-button"
          :disabled="isLoading || !userInput.trim()">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'กำลังคิด...' : 'ส่ง' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      messages: [],
      isLoading: false,
      API_TOKEN: import.meta.env.VITE_HUGGING_FACE_TOKEN,
      // เปลี่ยนเป็นโมเดลที่เหมาะกับการแชทภาษาไทย
      API_URL: 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill'
    }
  },

  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;
      
      const userMessage = this.userInput;
      
      // เพิ่มข้อความผู้ใช้
      this.messages.push({
        type: 'user',
        text: userMessage
      });
      
      this.userInput = ''; // เคลียร์ input
      this.isLoading = true;

      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: userMessage,
            options: {
              wait_for_model: true,
              use_cache: false
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // เพิ่มการตอบกลับจาก AI
        this.messages.push({
          type: 'ai',
          text: data[0]?.generated_text || 'ขออภัย ฉันไม่เข้าใจคำถามของคุณ กรุณาถามใหม่อีกครั้ง'
        });
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({
          type: 'error',
          text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>
/* Container styles */
.chat-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

/* Card styles */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

/* Header styles */
h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.robot-icon {
  font-size: 2.2rem;
  margin-right: 0.5rem;
  animation: bounce 2s infinite;
}

/* Chat messages container */
.chat-messages {
  height: 500px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  scrollbar-width: thin;
  scrollbar-color: #90caf9 transparent;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #90caf9;
  border-radius: 3px;
}

/* Message styles */
.message {
  margin-bottom: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  max-width: 85%;
  font-size: 1rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.3s ease-out;
}

.welcome-message {
  background: linear-gradient(135deg, #d4e9ff 0%, #e8f5e9 100%);
  color: #1a237e;
  margin: 0 auto 1.5rem auto;
  text-align: center;
  max-width: 95%;
  font-size: 1.1rem;
  padding: 1.5rem;
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.message.user {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  margin-left: auto;
  color: #0d47a1;
  border-bottom-right-radius: 4px;
}

.message.ai {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  margin-right: auto;
  color: #263238;
  border-bottom-left-radius: 4px;
}

.message.error {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  margin: 0 auto;
  text-align: center;
  border: 1px solid rgba(198, 40, 40, 0.1);
}

/* Input area styles */
.chat-input {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.form-control {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-control:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.2);
}

.send-button:disabled {
  background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Dark mode support */
:root[class~="dark"] .card {
  background: rgba(17, 25, 40, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[class~="dark"] h1 {
  color: #e0e0e0;
}

:root[class~="dark"] .chat-messages {
  background: rgba(17, 25, 40, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[class~="dark"] .welcome-message {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: #e3f2fd;
  border-color: rgba(255, 255, 255, 0.1);
}

:root[class~="dark"] .message.user {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: #e3f2fd;
}

:root[class~="dark"] .message.ai {
  background: linear-gradient(135deg, #263238 0%, #1a237e 100%);
  color: #fff;
}

:root[class~="dark"] .form-control {
  background: rgba(17, 25, 40, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:root[class~="dark"] .form-control:focus {
  border-color: #90caf9;
  box-shadow: 0 0 0 3px rgba(144, 202, 249, 0.2);
}
</style>