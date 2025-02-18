<template>
    <div class="container py-4">
      <div class="card shadow-lg" :class="darkMode ? 'dark-card' : 'light-card'">
        <div class="card-header border-0 bg-transparent">
          <h1 class="text-center">
            <i class="bi bi-robot"></i> AI cohere
          </h1>
        </div>
  
        <div class="card-body chat-container">
          <!-- Messages Area -->
          <div class="messages-area" ref="messagesContainer">
            <!-- Welcome Message -->
            <div class="message ai-message">
              <div class="message-content">
                <i class="bi bi-robot"></i>
                <div class="text">
                  สวัสดีครับ! ผมเป็น AI ผู้ช่วยของคุณ สามารถถามคำถามได้เลยครับ 😊
                </div>
              </div>
            </div>
  
            <!-- Chat Messages -->
            <div v-for="(message, index) in messages" 
                 :key="index"
                 :class="['message', message.type + '-message']"
            >
              <div class="message-content">
                <i :class="message.type === 'user' ? 'bi bi-person-circle' : 'bi bi-robot'"></i>
                <div class="text">{{ message.text }}</div>
              </div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
  
          <!-- Input Area -->
          <form @submit.prevent="sendMessage" class="chat-input-area">
            <div class="input-group">
              <input 
                v-model="userInput"
                type="text"
                class="form-control"
                placeholder="พิมพ์ข้อความของคุณ..."
                :disabled="isLoading"
              />
              <button 
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading || !userInput.trim()"
              >
                <i class="bi" :class="isLoading ? 'bi-hourglass-split' : 'bi-send'"></i>
                {{ isLoading ? 'กำลังคิด...' : 'ส่ง' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userInput: '',
        messages: [],
        isLoading: false,
        apiKey: import.meta.env.VITE_COHERE_API_KEY
      }
    },
  
    computed: {
      darkMode() {
        return localStorage.getItem("darkMode") === "true";
      }
    },
  
    methods: {
      async sendMessage() {
        if (!this.userInput.trim() || this.isLoading) return;
  
        const userMessage = this.userInput;
        this.userInput = '';
  
        // Add user message
        this.addMessage('user', userMessage);
  
        this.isLoading = true;
  
        try {
          const response = await axios.post('https://api.cohere.ai/v1/chat', 
            {
              message: userMessage,
              model: 'command',
              temperature: 0.7,
              return_chatlog: true
            },
            {
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
  
          // Add AI response
          this.addMessage('ai', response.data.text);
        } catch (error) {
          console.error('Error:', error);
          this.addMessage('ai', 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง');
        } finally {
          this.isLoading = false;
          this.scrollToBottom();
        }
      },
  
      addMessage(type, text) {
        this.messages.push({
          type,
          text,
          time: new Date().toLocaleTimeString('th-TH')
        });
      },
  
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.messagesContainer;
          container.scrollTop = container.scrollHeight;
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
    position: relative;
  }
  
  .messages-area {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .message {
    margin-bottom: 1rem;
    max-width: 80%;
  }
  
  .user-message {
    margin-left: auto;
  }
  
  .ai-message {
    margin-right: auto;
  }
  
  .message-content {
    display: flex;
    align-items: start;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .user-message .message-content {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    color: white;
  }
  
  .ai-message .message-content {
    background: white;
    color: #333;
  }
  
  .message i {
    font-size: 1.5rem;
  }
  
  .message-time {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.3rem;
    padding: 0 1rem;
  }
  
  .chat-input-area {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .form-control {
    border-radius: 1rem !important;
    padding: 0.8rem 1.2rem;
  }
  
  .btn {
    border-radius: 1rem !important;
    padding: 0.8rem 1.5rem;
  }
  
  /* Dark mode styles */
  .dark-card {
    background: rgba(33, 37, 41, 0.95);
    color: white;
  }
  
  .dark-card .ai-message .message-content {
    background: rgba(45, 55, 72, 0.9);
    color: white;
  }
  
  .dark-card .message-time {
    color: #aaa;
  }
  
  .dark-card .form-control {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .dark-card .form-control::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  /* Scrollbar styles */
  .messages-area::-webkit-scrollbar {
    width: 6px;
  }
  
  .messages-area::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .messages-area::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  .dark-card .messages-area::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .message {
      max-width: 90%;
    }
  
    .message-content {
      padding: 0.8rem;
    }
  }
  </style>