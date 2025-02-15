<template>
    <div class="container home-container">
      <div class="card shadow-lg p-4 text-center animate__animated animate__fadeIn" :class="darkMode ? 'dark-card' : 'light-card'">
        <h1 class="mb-4 animate__animated animate__fadeInDown">🌍 ยินดีต้อนรับสู่ Apiman Weather</h1>
        <p class="lead animate__animated animate__fadeInUp">ติดตามสภาพอากาศล่าสุดของประเทศไทย และข้อมูลข่าวสารที่สำคัญ</p>
  
        <router-link to="/weatherthailand" class="btn btn-primary btn-lg mt-3 animate__animated animate__pulse animate__infinite">
          🔍 ตรวจสอบสภาพอากาศ
        </router-link>
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
  </style>
  