<template>
  <div class="container py-4">
    <div class="card shadow-lg" :class="darkMode ? 'dark-card' : 'light-card'">
      <div class="card-header border-0 bg-transparent">
        <h1 class="text-center mb-0 animate__animated animate__fadeInDown">
          <i class="bi bi-newspaper me-2"></i>ข่าวล่าสุด
        </h1>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">กำลังโหลด...</span>
          </div>
        </div>

        <!-- News Grid -->
        <div v-else-if="news.length > 0" class="row g-4">
          <div v-for="(article, index) in news" 
               :key="index" 
               class="col-12 col-md-6 animate__animated animate__fadeIn">
            <div class="card h-100 news-card">
              <div class="position-relative">
                <img 
                  :src="article.image || '/default-news.jpg'" 
                  class="card-img-top news-image" 
                  :alt="article.title"
                  @error="handleImageError"
                >
                <div class="news-date-badge">
                  {{ formatDate(article.publishedAt) }}
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title news-title">{{ article.title }}</h5>
                <p class="card-text news-description flex-grow-1">{{ article.description }}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small class="text-muted">{{ article.source.name }}</small>
                  <a :href="article.url" 
                     target="_blank" 
                     class="btn btn-primary btn-sm"
                  >
                    <i class="bi bi-book-half me-1"></i>อ่านเพิ่มเติม
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted mb-3"></i>
          <h3>ไม่พบข่าวในขณะนี้</h3>
        </div>
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

.news-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--bs-card-bg);
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.news-image {
  height: 200px;
  object-fit: cover;
}

.news-date-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-top-left-radius: 1rem;
}

.news-title {
  font-size: 1.2rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-description {
  color: var(--bs-secondary-color);
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode */
.dark-card {
  background: rgba(33, 37, 41, 0.95);
  color: white;
}

.dark-card .news-card {
  background: rgba(45, 55, 72, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-card .news-title {
  color: white;
}

.dark-card .news-description {
  color: rgba(255, 255, 255, 0.8);
}

.dark-card .text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .news-card {
    margin-bottom: 1rem;
  }

  .news-title {
    font-size: 1.1rem;
  }

  .news-description {
    font-size: 0.9rem;
  }
}

/* Loading animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Card hover effect */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}
</style>