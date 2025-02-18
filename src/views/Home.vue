<template>
  <div class="home-page">
    <div class="container py-5">
      <div class="row g-4 justify-content-center">
        <!-- Weather Card -->
        <div class="col-12 col-md-6 col-lg-6">
          <div class="card feature-card h-100 shadow-lg p-4 text-center animate__animated animate__fadeIn" 
               :class="darkMode ? 'dark-card' : 'light-card'">
            <div class="card-body">
              <i class="bi bi-cloud-sun card-icon mb-3"></i>
              <h2 class="card-title h3 mb-3 animate__animated animate__fadeInDown">🌤️ สภาพอากาศ</h2>
              <p class="card-text mb-4 animate__animated animate__fadeInUp">
                ตรวจสอบสภาพอากาศล่าสุดในประเทศไทย พร้อมข้อมูลที่แม่นยำ
              </p>
              <router-link to="/weatherthailand" class="btn btn-primary btn-lg animate__animated animate__pulse w-100">
                <i class="bi bi-search me-2"></i>ตรวจสอบสภาพอากาศ
              </router-link>
            </div>
          </div>
        </div>

        <!-- News Card -->
        <div class="col-12 col-md-6 col-lg-6">
          <div class="card feature-card h-100 shadow-lg p-4 text-center animate__animated animate__fadeIn" 
               :class="darkMode ? 'dark-card' : 'light-card'">
            <div class="card-body">
              <i class="bi bi-newspaper card-icon mb-3"></i>
              <h2 class="card-title h3 mb-3 animate__animated animate__fadeInDown">📰 ข่าวสาร</h2>
              <p class="card-text mb-4 animate__animated animate__fadeInUp">
                อัพเดทข่าวสารเกี่ยวกับสภาพอากาศและภัยธรรมชาติ
              </p>
              <router-link to="/news" class="btn btn-primary btn-lg animate__animated animate__pulse w-100">
                <i class="bi bi-book me-2"></i>อ่านข่าว
              </router-link>
            </div>
          </div>
        </div>

        <!-- World Time Card -->
        <div class="col-12 col-md-6 col-lg-6">
          <div class="card feature-card h-100 shadow-lg p-4 text-center animate__animated animate__fadeIn" 
               :class="darkMode ? 'dark-card' : 'light-card'">
            <div class="card-body">
              <i class="bi bi-globe card-icon mb-3"></i>
              <h2 class="card-title h3 mb-3 animate__animated animate__fadeInDown">🌐 เวลาทั่วโลก</h2>
              <p class="card-text mb-4 animate__animated animate__fadeInUp">
                ดูเวลาในแต่ละประเทศทั่วโลกแบบเรียลไทม์
              </p>
              <router-link to="/world-time" class="btn btn-primary btn-lg animate__animated animate__pulse w-100">
                <i class="bi bi-clock me-2"></i>ดูเวลา
              </router-link>
            </div>
          </div>
        </div>

        <!-- AI Chat Card -->
        <div class="col-12 col-md-6 col-lg-6">
          <div class="card feature-card h-100 shadow-lg p-4 text-center animate__animated animate__fadeIn" 
               :class="darkMode ? 'dark-card' : 'light-card'">
            <div class="card-body">
              <i class="bi bi-robot card-icon mb-3"></i>
              <h2 class="card-title h3 mb-3 animate__animated animate__fadeInDown">🤖 Huggingface</h2>
              <p class="card-text mb-4 animate__animated animate__fadeInUp">
                สอบถามข้อมูลและพูดคุยกับ AI Huggingface ผู้ช่วยของคุณ
              </p>
              <router-link to="/chat-ai" class="btn btn-primary btn-lg animate__animated animate__pulse w-100">
                <i class="bi bi-chat-dots me-2"></i>แชทกับ Huggingface
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-6">
          <div class="card feature-card h-100 shadow-lg p-4 text-center animate__animated animate__fadeIn" 
               :class="darkMode ? 'dark-card' : 'light-card'">
            <div class="card-body">
              <i class="bi bi-robot card-icon mb-3"></i>
              <h2 class="card-title h3 mb-3 animate__animated animate__fadeInDown">✨ Cohere</h2>
              <p class="card-text mb-4 animate__animated animate__fadeInUp">
                สอบถามข้อมูลและพูดคุยกับ AI Cohere ผู้ช่วยของคุณ
              </p>
              <router-link to="/chat-ai1" class="btn btn-primary btn-lg animate__animated animate__pulse w-100">
                <i class="bi bi-chat-dots me-2"></i>แชทกับ Cohere
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    computed: {
      darkMode() {
        return localStorage.getItem("darkMode") === "true";
      }
    }
  };
  </script>
  
  <style scoped>
  /* Container with parallax effect */
  .home-container {
    background: url("/weather.jpg") no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  /* Overlay for better text readability */
  .home-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    z-index: 1;
  }
  
  /* Enhanced Glassmorphism card */
  .card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 3rem 2rem;
    max-width: 700px;
    width: 100%;
    position: relative;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;
  }
  
  /* Light mode card */
  .light-card {
    background: rgba(255, 255, 255, 0.85);
    color: #1a237e;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(255, 255, 255, 0.1);
  }
  
  /* Dark mode card */
  .dark-card {
    background: rgba(23, 32, 42, 0.85);
    color: #ffffff;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 2px 8px rgba(255, 255, 255, 0.05);
  }
  
  /* Enhanced typography */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .lead {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-weight: 400;
  }
  
  /* Enhanced button styles */
  .btn-primary {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
  }
  
  .btn-primary:active {
    transform: translateY(0);
  }
  
  /* Weather icon animation */
  h1 > span {
    display: inline-block;
    animation: float 3s ease-in-out infinite;
  }
  
  /* Custom animations */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  /* Animation classes enhancement */
  .animate__animated {
    animation-duration: 1s;
  }
  
  .animate__pulse {
    animation-duration: 2s;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card {
      padding: 2rem 1.5rem;
      margin: 1rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    .lead {
      font-size: 1.1rem;
    }
  
    .btn-primary {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }
  }
  
  /* Enhanced dark mode text */
  .dark-card .lead {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .dark-card .btn-primary {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  }
  
  .dark-card .btn-primary:hover {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  }

  .home-page {
  min-height: 100vh;
  padding: 3rem 0;
  background: url("/weather.jpg") no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

.feature-card {
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a237e;
}

.card-text {
  font-size: 1.1rem;
  color: #666;
}

.light-card {
  background: rgba(255, 255, 255, 0.9);
}

.dark-card {
  background: rgba(23, 32, 42, 0.9);
}

.dark-card .card-title {
  color: #fff;
}

.dark-card .card-text {
  color: #ddd;
}

.btn-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border: none;
  padding: 0.8rem 2rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.3);
}

@media (max-width: 768px) {
  .home-page {
    padding: 2rem 0;
  }
  
  .feature-card {
    margin-bottom: 1rem;
  }
}
  </style>
  