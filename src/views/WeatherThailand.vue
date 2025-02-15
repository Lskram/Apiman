<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 text-center animate__animated animate__fadeIn" :class="darkMode ? 'bg-dark text-white' : 'bg-light'">
      <h1 class="mb-4 animate__animated animate__fadeInDown">🌤️ พยากรณ์อากาศประเทศไทย</h1>
      
      <!-- Input ค้นหาชื่อเมือง -->
      <div class="input-group mb-3 position-relative">
        <input 
          v-model="searchQuery" 
          class="form-control animate__animated animate__fadeIn"
          placeholder="พิมพ์ชื่อเมือง เช่น เชียงใหม่, ขอนแก่น"
          @input="fetchSuggestedCities"
        />
        <button class="btn btn-primary animate__animated animate__pulse animate__infinite" @click="fetchCoordinates">
          🔍 ค้นหา
        </button>
        
        <!-- แสดงตัวเลือกเมืองที่เกี่ยวข้อง -->
        <transition-group name="fade">
          <ul v-if="suggestedCities.length > 0" class="list-group position-absolute w-100">
            <li 
              v-for="(city, index) in suggestedCities" 
              :key="index" 
              class="list-group-item list-group-item-action animate__animated animate__fadeInLeft"
              @click="selectCity(city)"
            >
              {{ city.name }} ({{ city.country }})
            </li>
          </ul>
        </transition-group>
      </div>

      <!-- แสดงข้อมูลสภาพอากาศ -->
      <transition name="slide">
        <div v-if="weather" class="mt-4">
          <h2 class="fw-bold animate__animated animate__fadeInUp">📍 {{ weather.city }}, {{ weather.country }}</h2>
          <div class="row">
            <div class="col-md-6" v-for="(info, key) in weatherDetails" :key="key">
              <div class="card shadow-sm p-3 mb-3 animate__animated animate__zoomIn" :class="darkMode ? 'bg-secondary text-white' : 'bg-light'">
                <h5>{{ info.icon }} {{ info.label }}</h5>
                <p class="display-5">{{ info.value }}</p>
              </div>
            </div>
          </div>
          <p class="text-muted mt-3 animate__animated animate__fadeIn">🕒 อัปเดตล่าสุด: {{ weather.last_updated }}</p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__shakeX">
          {{ error }}
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
</style>