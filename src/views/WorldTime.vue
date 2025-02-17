<template>
  <div class="container mt-5">
    <div class="card main-card" :class="darkMode ? 'dark-theme' : 'light-theme'">
      <!-- Header -->
      <div class="card-header">
        <h1>
          <span class="globe-icon">🌐</span>
          <span>World Time</span>
        </h1>
      </div>

      <!-- Main Content -->
      <div class="card-body">
        <!-- City Selector -->
        <div class="select-wrapper">
          <select v-model="selectedCity" class="city-select" @change="handleCityChange">
            <option value="">Select City</option>
            <option v-for="city in cities" :key="city.id" :value="city">
              {{ city.name }}, {{ city.country }}
            </option>
          </select>
        </div>

        <!-- Main Clock Display -->
        <div v-if="selectedCity" class="main-clock">
          <transition name="fade" mode="out-in">
            <div v-if="!loading" class="clock-content">
              <div class="time">{{ currentTime }}</div>
              <div class="date">{{ currentDate }}</div>
              <div class="location">
                {{ selectedCity.name }}, {{ selectedCity.country }}
              </div>
              <div class="timezone">{{ timezone }}</div>
            </div>
          </transition>
        </div>

        <!-- World Clocks Grid -->
        <div class="world-clocks">
          <div v-for="city in cities" :key="city.id" class="clock-card"
            :class="{ active: selectedCity?.id === city.id }" @click="selectCity(city)">
            <div class="card-time">{{ getCityTime(city) }}</div>
            <div class="card-date">{{ getCityDate(city) }}</div>
            <div class="card-location">
              {{ city.name }}, {{ city.country }}
            </div>
            <div class="card-timezone">{{ city.timezone }}</div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCity: null,
      loading: false,
      error: null,
      currentTime: '',
      currentDate: '',
      timezone: '',
      cities: [
        {
          id: 1,
          name: 'Bangkok',
          country: 'Thailand',
          timezone: 'Asia/Bangkok',
          offset: 7
        },
        {
          id: 2,
          name: 'Tokyo',
          country: 'Japan',
          timezone: 'Asia/Tokyo',
          offset: 9
        },
        {
          id: 3,
          name: 'London',
          country: 'UK',
          timezone: 'Europe/London',
          offset: 0
        },
        {
          id: 4,
          name: 'New York',
          country: 'USA',
          timezone: 'America/New_York',
          offset: -5
        },
        {
          id: 5,
          name: 'Paris',
          country: 'France',
          timezone: 'Europe/Paris',
          offset: 1
        },
        {
          id: 6,
          name: 'Singapore',
          country: 'Singapore',
          timezone: 'Asia/Singapore',
          offset: 8
        }
      ],
      timeInterval: null
    }
  },

  computed: {
    darkMode() {
      return localStorage.getItem("darkMode") === "true"
    }
  },

  methods: {
    updateTime() {
      if (!this.selectedCity) return

      try {
        const now = new Date()
        const cityTime = new Date(now.getTime() + (this.selectedCity.offset * 3600000))

        this.currentTime = cityTime.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })

        this.currentDate = cityTime.toLocaleDateString('th-TH', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        this.timezone = `(GMT${this.selectedCity.offset >= 0 ? '+' : ''}${this.selectedCity.offset}:00)`
      } catch (error) {
        console.error('Error updating time:', error)
        this.error = 'Error updating time'
      }
    },

    getCityTime(city) {
      const now = new Date()
      const cityTime = new Date(now.getTime() + (city.offset * 3600000))
      return cityTime.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getCityDate(city) {
      const now = new Date()
      const cityTime = new Date(now.getTime() + (city.offset * 3600000))
      return cityTime.toLocaleDateString('th-TH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    },

    handleCityChange() {
      this.updateTime()
    },

    selectCity(city) {
      this.selectedCity = city
      this.updateTime()
    },

    startClock() {
      this.timeInterval = setInterval(() => {
        this.updateTime()
      }, 1000)
    },

    stopClock() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
    }
  },

  mounted() {
    this.selectedCity = this.cities[0]
    this.updateTime()
    this.startClock()
  },

  beforeUnmount() {
    this.stopClock()
  }
}
</script>

<style scoped>
.main-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.globe-icon {
  font-size: 3rem;
  animation: rotate 20s linear infinite;
}

.select-wrapper {
  max-width: 400px;
  margin: 0 auto 2rem;
}

.city-select {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid rgba(25, 118, 210, 0.1);
  font-size: 1.1rem;
  background-color: white;
  transition: all 0.3s ease;
}

.main-clock {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 2rem;
}

.time {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.date {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.location {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.timezone {
  font-size: 1.2rem;
  opacity: 0.8;
}

.world-clocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.clock-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.clock-card.active {
  border: 2px solid #1976d2;
}

.card-time {
  font-size: 2rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 0.5rem;
}

.card-date {
  color: #666;
  margin-bottom: 0.5rem;
}

.card-location {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card-timezone {
  font-size: 0.9rem;
  color: #666;
}

/* Dark Theme */
.dark-theme {
  background: rgba(23, 32, 42, 0.95);
  color: white;
}

.dark-theme .city-select {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.dark-theme .clock-card {
  background: rgba(30, 41, 59, 0.8);
  color: white;
}

.dark-theme .card-time {
  color: #90caf9;
}

.dark-theme .card-date,
.dark-theme .card-timezone {
  color: rgba(255, 255, 255, 0.7);
}

.dark-theme .clock-card.active {
  border-color: #90caf9;
}

/* Animations */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
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

/* Loading Spinner */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-card {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .time {
    font-size: 3rem;
  }

  .date {
    font-size: 1.2rem;
  }

  .location {
    font-size: 1.5rem;
  }

  .clock-card {
    margin-bottom: 1rem;
  }
}
</style>