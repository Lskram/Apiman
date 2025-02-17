<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 text-center" :class="darkMode ? 'bg-dark text-white' : 'bg-light'">
      <h1 class="mb-4 animate__animated animate__fadeInDown">
        <span class="weather-icon">🌤️</span> 
        พยากรณ์อากาศประเทศไทย
      </h1>
      
      <!-- Search Section -->
      <div class="search-section">
        <div class="search-wrapper">
          <div class="input-group">
            <input 
              v-model="searchQuery" 
              class="form-control custom-input"
              placeholder="พิมพ์ชื่อเมือง เช่น เชียงใหม่, ขอนแก่น"
              @input="fetchSuggestedCities"
              autocomplete="off"
            />
            <button 
              class="btn btn-primary custom-button"
              @click="fetchCoordinates"
              :disabled="!searchQuery.trim()"
            >
              <span class="search-icon">🔍</span>
              <span class="search-text">ค้นหา</span>
            </button>
          </div>

          <!-- Suggestions Dropdown -->
          <div v-if="suggestedCities.length > 0" class="suggestions-dropdown">
            <div class="suggestions-list">
              <div 
                v-for="(city, index) in suggestedCities" 
                :key="index"
                class="suggestion-item"
                @click="selectCity(city)"
              >
                <div class="location-info">
                  <span class="location-icon">📍</span>
                  <span class="city-name">{{ city.name }}</span>
                  <span class="country-name">{{ city.country }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weather Results -->
      <transition name="fade">
        <div v-if="weather" class="weather-results mt-4">
          <div class="location-header">
            <h2 class="city-title">
              <span class="location-pin">📍</span>
              {{ weather.city }}, {{ weather.country }}
            </h2>
          </div>
          
          <div class="weather-grid">
            <div v-for="(info, key) in weatherDetails" 
                 :key="key"
                 class="weather-card"
                 :class="darkMode ? 'dark' : 'light'"
            >
              <div class="card-content">
                <div class="weather-info-icon">{{ info.icon }}</div>
                <div class="info-details">
                  <div class="info-label">{{ info.label }}</div>
                  <div class="info-value">{{ info.value }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="update-info">
            <span class="time-icon">🕒</span>
            <span class="update-text">อัปเดตล่าสุด: {{ weather.last_updated }}</span>
          </div>
        </div>
      </transition>

      <!-- Error Message -->
      <transition name="fade">
        <div v-if="error" class="error-message">
          <div class="alert alert-danger">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      weather: null,
      error: null,
      suggestedCities: []
    };
  },
  computed: {
    darkMode() {
      return localStorage.getItem("darkMode") === "true";
    },
    weatherDetails() {
      return this.weather ? [
        { label: "อุณหภูมิ", icon: "🌡️", value: `${this.weather.temperature} °C` },
        { label: "ความเร็วลม", icon: "💨", value: `${this.weather.wind_speed} กม./ชม.` },
        { label: "ทิศทางลม", icon: "🧭", value: `${this.weather.wind_direction}°` },
        { label: "ความชื้นสัมพัทธ์", icon: "💦", value: `${this.weather.humidity}%` },
        { label: "ความกดอากาศ", icon: "📉", value: `${this.weather.pressure} hPa` }
      ] : [];
    }
  },
  methods: {
    async fetchSuggestedCities() {
      if (this.searchQuery.length < 2) {
        this.suggestedCities = [];
        return;
      }

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.searchQuery}&count=5&language=th`;

      try {
        const response = await axios.get(geoUrl);
        if (response.data.results) {
          this.suggestedCities = response.data.results.map(city => ({
            name: city.name,
            country: city.country,
            lat: city.latitude,
            lon: city.longitude
          }));
        } else {
          this.suggestedCities = [];
        }
      } catch (err) {
        this.suggestedCities = [];
      }
    },

    selectCity(city) {
      this.searchQuery = city.name;
      this.suggestedCities = [];
      this.fetchWeather(city.lat, city.lon, city.name, city.country);
    },

    async fetchCoordinates() {
      if (!this.searchQuery) {
        this.error = "❌ กรุณาพิมพ์ชื่อเมืองหรือจังหวัด";
        return;
      }

      if (this.suggestedCities.length > 0) {
        this.selectCity(this.suggestedCities[0]);
        return;
      }

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.searchQuery}&count=1&language=th`;

      try {
        const response = await axios.get(geoUrl);
        if (!response.data.results || response.data.results.length === 0) {
          this.error = "❌ ไม่พบเมืองที่ค้นหา กรุณาลองใหม่";
          return;
        }

        const city = response.data.results[0];
        this.fetchWeather(city.latitude, city.longitude, city.name, city.country);
      } catch (err) {
        this.error = "❌ ไม่สามารถค้นหาพิกัดของเมืองได้";
      }
    },

    async fetchWeather(lat, lon, cityName, countryName) {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

      try {
        const response = await axios.get(weatherUrl);
        this.weather = {
          city: cityName,
          country: countryName,
          temperature: response.data.current_weather.temperature,
          wind_speed: response.data.current_weather.windspeed,
          wind_direction: response.data.current_weather.winddirection,
          humidity: response.data.current_weather.relativehumidity,
          pressure: response.data.current_weather.pressure,
          last_updated: new Date(response.data.current_weather.time).toLocaleString()
        };
        this.error = null;
      } catch (err) {
        this.error = "❌ ไม่สามารถดึงข้อมูลอากาศได้";
      }
    }
  }
};
</script>

<style scoped>
/* Container styling */
.container {
  padding: 2rem;
  min-height: 100vh;
  background: url("/weather.jpg") no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%);
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
  transition: all 0.3s ease;
}

/* Light & Dark mode */
.bg-light {
  background: rgba(255, 255, 255, 0.85) !important;
}

.bg-dark {
  background: rgba(23, 32, 42, 0.85) !important;
}

/* Header styling */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Search input styling */
.input-group {
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.form-control {
  height: 3.5rem;
  border-radius: 12px !important;
  border: 2px solid rgba(25, 118, 210, 0.1);
  padding: 0 1.5rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
}

.form-control:focus {
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  border-color: #1976d2;
}

.btn-primary {
  border-radius: 12px !important;
  padding: 0 1.5rem;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border: none;
  font-weight: 500;
  margin-left: 0.5rem !important;
  height: 3.5rem;
  min-width: 120px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.3);
}

/* City suggestions list */
.list-group {
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.98);
}

.list-group-item {
  padding: 1rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

/* Weather information cards */
.weather-info {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
}

.bg-secondary.weather-info {
  background: rgba(45, 55, 72, 0.9) !important;
}

.weather-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.weather-info h5 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1976d2;
}

.bg-secondary .weather-info h5 {
  color: #90caf9;
}

.display-5 {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
}

/* Error message */
.alert-danger {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #d32f2f;
  border-radius: 12px;
  padding: 1rem 1.5rem;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-enter-active {
  animation: slideIn 0.5s ease-out;
}

.slide-leave-active {
  animation: slideIn 0.5s ease-in reverse;
}

/* Dark mode adjustments */
.bg-dark .form-control {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.bg-dark .form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.bg-dark .list-group {
  background: rgba(45, 55, 72, 0.98);
}

.bg-dark .list-group-item {
  background: transparent;
  color: white;
}

.bg-dark .list-group-item:hover {
  background: rgba(144, 202, 249, 0.1);
  color: #90caf9;
}

.bg-dark .text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .form-control, .btn-primary {
    height: 3rem;
  }

  .display-5 {
    font-size: 2rem;
  }
}

/* Custom scrollbar */
.list-group::-webkit-scrollbar {
  width: 6px;
}

.list-group::-webkit-scrollbar-track {
  background: transparent;
}

.list-group::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.bg-dark .list-group::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Search Section Styles */
.search-section {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-wrapper {
  position: relative;
}

.custom-input {
  height: 3.5rem;
  border-radius: 15px !important;
  padding: 0 1.5rem;
  font-size: 1.1rem;
  border: 2px solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
}

.custom-button {
  min-width: 120px;
  border-radius: 12px !important;
  margin-left: 0.5rem !important;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border: none;
  height: 3.5rem;
  font-weight: 500;
}

/* Suggestions Dropdown Styles */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
}

.suggestions-list {
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.suggestion-item:hover {
  background: rgba(25, 118, 210, 0.1);
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.city-name {
  font-weight: 600;
  color: #1976d2;
}

.country-name {
  color: #666;
  font-size: 0.9rem;
}

/* Weather Results Styles */
.weather-results {
  padding: 2rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.weather-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.weather-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-info-icon {
  font-size: 2.5rem;
}

.info-details {
  text-align: left;
}

.info-label {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
}

/* Dark Mode Styles */
.dark .custom-input {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .suggestions-dropdown {
  background: #1a2634;
}

.dark .suggestion-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .city-name {
  color: #90caf9;
}

.dark .country-name {
  color: #aaa;
}

.dark .suggestion-item:hover {
  background: rgba(144, 202, 249, 0.1);
}

.dark .weather-card {
  background: rgba(45, 55, 72, 0.9);
}

.dark .info-label {
  color: #aaa;
}

.dark .info-value {
  color: #90caf9;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>