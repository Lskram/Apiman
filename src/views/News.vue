<template>
  <div class="container news-container">
    <div class="card shadow-lg p-4" :class="darkMode ? 'dark-card' : 'light-card'">
      <h1 class="mb-4 animate__animated animate__fadeInDown">
        📰 ข่าวล่าสุด
      </h1>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">กำลังโหลด...</span>
        </div>
      </div>

      <!-- News Grid -->
      <div v-else-if="news.length > 0" class="row g-4">
        <div v-for="(article, index) in news" 
             :key="index" 
             class="col-md-6 animate__animated animate__fadeIn">
          <div class="news-card h-100">
            <img 
              :src="article.image || '/default-news.jpg'" 
              class="news-image" 
              :alt="article.title"
              @error="handleImageError"
            >
            <div class="news-content">
              <h5 class="news-title">{{ article.title }}</h5>
              <p class="news-description">{{ article.description }}</p>
              <div class="news-footer">
                <small class="text-muted">
                  {{ formatDate(article.publishedAt) }} | {{ article.source.name }}
                </small>
                <a :href="article.url" 
                   target="_blank" 
                   class="btn btn-primary btn-sm">
                  อ่านเพิ่มเติม
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else class="text-center my-5">
        <h3>ไม่พบข่าวในขณะนี้</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      news: [],
      loading: true,
      error: null
    }
  },
  computed: {
    darkMode() {
      return localStorage.getItem("darkMode") === "true";
    }
  },
  methods: {
    async fetchNews() {
      try {
        const apiKey = import.meta.env.VITE_GNEWS_TOKEN;
        const response = await axios.get(`https://gnews.io/api/v4/search?q=weather&lang=th&country=th&max=10&apikey=${apiKey}`);
        
        if (response.data.articles) {
          this.news = response.data.articles;
        }
        this.loading = false;
      } catch (error) {
        this.error = "ไม่สามารถโหลดข่าวได้ในขณะนี้";
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    handleImageError(e) {
      e.target.src = '/default-news.jpg';
    }
  },
  mounted() {
    this.fetchNews();
  }
}
</script>

<style scoped>
.news-container {
  padding: 2rem;
}

.news-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  transition: transform 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 1.5rem;
}

.news-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* Dark mode */
.dark-card {
  background: rgba(23, 32, 42, 0.85);
  color: white;
}

.dark-card .news-card {
  background: rgba(45, 55, 72, 0.9);
}

.dark-card .news-title {
  color: white;
}

.dark-card .news-description {
  color: #ddd;
}

.dark-card .text-muted {
  color: #aaa !important;
}
</style>