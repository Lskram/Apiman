// App.vue
<template>
  <div class="app">
    <!-- Glassmorphism Navbar -->
    <nav class="navbar" :class="{'navbar-dark': darkMode}">
      <div class="nav-container">
        <!-- Brand -->
        <a class="navbar-brand" href="#">
          <span class="brand-icon">🌍</span>
          <span class="brand-text">Apiman Weather</span>
        </a>

        <!-- Navigation Links -->
        <div class="nav-links">
          <router-link to="/" class="nav-item" active-class="active">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Home</span>
          </router-link>
          
          <router-link to="/weatherthailand" class="nav-item" active-class="active">
            <span class="nav-icon">🌤️</span>
            <span class="nav-text">Weather</span>
          </router-link>
          
          <router-link to="/news" class="nav-item" active-class="active">
            <span class="nav-icon">📰</span>
            <span class="nav-text">News</span>
          </router-link>
          
          <router-link to="/chat-ai" class="nav-item" active-class="active">
            <span class="nav-icon">🤖</span>
            <span class="nav-text">Chat AI</span>
          </router-link>
        </div>

        <!-- Dark Mode Toggle -->
        <button 
          @click="toggleDarkMode" 
          class="theme-toggle"
          :class="{'theme-toggle-dark': darkMode}"
        >
          <span class="toggle-icon">{{ darkMode ? '🌞' : '🌙' }}</span>
          <span class="toggle-text">{{ darkMode ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </nav>

    <!-- Content Area with Smooth Transition -->
    <main class="main-content" :class="{'dark-mode': darkMode}">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
/* Base Styles */
.app {
  min-height: 100vh;
  background: url("/weather.jpg") no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
}

/* Navbar Styles */
.navbar {
  position: relative;
  z-index: 10;
  padding: 1rem 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-dark {
  background: rgba(23, 32, 42, 0.85);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand Styles */
.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
  transition: all 0.3s ease;
}

.navbar-dark .navbar-brand {
  color: #fff;
}

.brand-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
  animation: float 3s ease-in-out infinite;
}

.brand-text {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.navbar-dark .brand-text {
  background: linear-gradient(135deg, #90caf9, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 1rem;
  margin: 0 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #1a237e;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.navbar-dark .nav-item {
  color: #fff;
}

.nav-item:hover {
  background: rgba(25, 118, 210, 0.1);
  transform: translateY(-2px);
}

.nav-item.active {
  background: rgba(25, 118, 210, 0.15);
  color: #1976d2;
}

.navbar-dark .nav-item.active {
  background: rgba(144, 202, 249, 0.15);
  color: #90caf9;
}

.nav-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

/* Theme Toggle Button */
.theme-toggle {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle-dark {
  background: rgba(144, 202, 249, 0.1);
  color: #90caf9;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  background: rgba(25, 118, 210, 0.2);
}

.toggle-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

/* Main Content Area */
.main-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    margin: 1rem 0;
    gap: 0.5rem;
  }

  .nav-item {
    padding: 0.5rem;
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    margin: 0;
    font-size: 1.5rem;
  }

  .theme-toggle {
    padding: 0.5rem;
  }

  .toggle-text {
    display: none;
  }
}
</style>

<script>
export default {
  data() {
    return {
      darkMode: localStorage.getItem("darkMode") === "true"
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
      // Trigger a custom event that other components can listen to
      this.$emit('darkModeChanged', this.darkMode);
    }
  },
  mounted() {
    // Apply initial dark mode class to body
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    }
  },
  watch: {
    darkMode(newValue) {
      // Update body class when dark mode changes
      document.body.classList.toggle('dark-mode', newValue);
    }
  }
};
</script>