<template>
    <div class="container news-container">
      <div class="card shadow-lg p-4 text-center animate__animated animate__fadeIn" :class="darkMode ? 'dark-card' : 'light-card'">
        <h1 class="mb-4 animate__animated animate__fadeInDown">🌦️ ข่าวสภาพอากาศ</h1>
  
        <!-- แสดงสถานะโหลดข่าว -->
        <div v-if="loading" class="spinner-border text-primary" role="status">
          <span class="sr-only">กำลังโหลด...</span>
        </div>
  
        <!-- แสดงรายการข่าว -->
        <div v-if="news.length > 0" class="row">
          <div v-for="(article, index) in news" :key="index" class="col-md-6">
            <div class="news-card shadow-sm p-3 mb-3 animate__animated animate__zoomIn" :class="darkMode ? 'bg-secondary text-white' : 'bg-light'">
              <img :src="article.urlToImage || '/default-news.jpg'" class="news-image" alt="ข่าว" v-if="article.urlToImage">
              <h5>{{ article.title }}</h5>
              <p class="text-muted">{{ article.source.name }} | {{ formatDate(article.publishedAt) }}</p>
              <a :href="article.url" target="_blank" class="btn btn-primary">อ่านเพิ่มเติม</a>
            </div>
          </div>
        </div>
  
        <!-- แสดงข้อผิดพลาด -->
        <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__shakeX">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        news: [],
        loading: true,
        error: null
      };
    },
    computed: {
      darkMode() {
        return localStorage.getItem("darkMode") === "true";
      }
    },
    methods: {
      async fetchNews() {
        const apiKey = ""; // 🔥 API Key ของคุณ
        const apiUrl = `https://newsapi.org/v2/everything?q=weather OR storm OR flood OR climate OR typhoon OR tornado&language=en&pageSize=10&apiKey=${apiKey}`;
  
        try {
          const response = await axios.get(apiUrl);
          console.log("📢 API Response:", response.data); // ✅ ตรวจสอบ API Response
  
          if (response.data.articles && response.data.articles.length > 0) {
            this.news = response.data.articles;
            console.log("✅ ข่าวที่ได้รับ:", this.news); // ✅ ตรวจสอบข่าวที่โหลดมา
          } else {
            this.error = "❌ ไม่มีข่าวเกี่ยวกับสภาพอากาศที่แสดง";
          }
  
          this.loading = false;
        } catch (err) {
          this.error = "❌ ไม่สามารถดึงข่าวได้";
          console.error("🚨 เกิดข้อผิดพลาด:", err);
          this.loading = false;
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
    },
    mounted() {
      this.fetchNews();
    }
  };
  </script>
  
  <style scoped>
  /* Container styling */
  .news-container {
    background: url("/weather.jpg") no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    padding: 2rem 0;
    position: relative;
  }
  
  .news-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 1;
  }
  
  /* Main card container */
  .card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 2;
    overflow: hidden;
    margin: 0 auto;
    max-width: 1200px;
  }
  
  /* Light & Dark mode cards */
  .light-card {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(255, 255, 255, 0.1);
  }
  
  .dark-card {
    background: rgba(23, 32, 42, 0.85);
    color: #ffffff;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 2px 8px rgba(255, 255, 255, 0.05);
  }
  
  /* Header styling */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a237e;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .dark-card h1 {
    color: #fff;
  }
  
  /* News card styling */
  .news-card {
    backdrop-filter: blur(8px);
    border-radius: 16px;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  
  .light-card .news-card {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .dark-card .news-card {
    background: rgba(45, 55, 72, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  /* Image container */
  .news-image-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  
  .news-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .news-card:hover .news-image {
    transform: scale(1.05);
  }
  
  /* News content */
  .news-card h5 {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 1rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .text-muted {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .dark-card .text-muted {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  /* Button styling */
  .btn-primary {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: auto;
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(21, 101, 192, 0.3);
  }
  
  /* Loading spinner */
  .spinner-border {
    width: 3rem;
    height: 3rem;
    color: #1976d2 !important;
  }
  
  .dark-card .spinner-border {
    color: #90caf9 !important;
  }
  
  /* Error message */
  .alert-danger {
    background: rgba(244, 67, 54, 0.1);
    border: 1px solid rgba(244, 67, 54, 0.3);
    color: #d32f2f;
    border-radius: 12px;
    padding: 1rem;
    margin-top: 2rem;
  }
  
  .dark-card .alert-danger {
    background: rgba(244, 67, 54, 0.2);
    color: #ff8a80;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .news-container {
      padding: 1rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    .news-card {
      margin-bottom: 1.5rem;
    }
  
    .news-card h5 {
      font-size: 1.1rem;
    }
  }
  
  /* Animation durations */
  .animate__animated {
    animation-duration: 0.8s;
  }
  
  .animate__zoomIn {
    animation-duration: 0.6s;
  }
  </style>