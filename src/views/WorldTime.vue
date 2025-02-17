```vue
<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4" :class="darkMode ? 'dark-card' : 'light-card'">
      <!-- Header -->
      <h1 class="title">
        <span class="globe-icon">🌐</span>
        World Time
      </h1>

      <!-- Time Zone Selector -->
      <div class="select-container">
        <select 
          v-model="selectedZone"
          class="zone-select"
          @change="fetchTimeForZone"
        >
          <option value="">เลือกเขตเวลา (Timezone)</option>
          <optgroup label="ยอดนิยม">
            <option v-for="zone in popularZones" :key="zone" :value="zone">
              {{ formatZoneName(zone) }}
            </option>
          </optgroup>
          <optgroup label="ทั้งหมด">
            <option v-for="zone in availableZones" :key="zone" :value="zone">
              {{ formatZoneName(zone) }}
            </option>
          </optgroup>
        </select>
      </div>

      <!-- Main Time Display -->
      <div v-if="currentTime" class="main-time-card">
        <div class="time-display">
          <div class="current-time">{{ currentTime.time }}</div>
          <div class="current-date">{{ currentTime.date }}</div>
        </div>
        <div class="timezone-info">
          <div class="zone-name">{{ formatZoneName(currentTime.timezone) }}</div>
          <div class="zone-details">
            <span class="offset">{{ currentTime.offset }}</span>
            <span class="abbreviation">{{ currentTime.abbreviation }}</span>
            <span class="country">{{ currentTime.countryCode }}</span>
          </div>
        </div>
      </div>

      <!-- Popular Timezones Grid -->
      <div class="popular-times-grid">
        <div 
          v-for="time in popularTimes" 
          :key="time.timezone"
          class="time-card"
          :class="{ active: selectedZone === time.timezone }"
          @click="selectedZone = time.timezone"
        >
          <div class="time">{{ time.time }}</div>
          <div class="date">{{ time.date }}</div>
          <div class="location">{{ formatZoneName(time.timezone) }}</div>
          <div class="details">
            <span class="offset-badge">{{ time.offset }}</span>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <span>กำลังโหลด...</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      API_KEY: import.meta.env.VITE_TIMEZONE_API_KEY,
      selectedZone: '',
      currentTime: null,
      popularTimes: [],
      availableZones: [],
      error: null,
      loading: false,
      popularZones: [
        'Asia/Bangkok',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Asia/Singapore',
        'Europe/Paris'
      ]
    }
  },

  computed: {
    darkMode() {
      return localStorage.getItem("darkMode") === "true";
    }
  },

  methods: {
    async fetchTimeForZone(zone = 'Asia/Bangkok') {
      this.loading = true;
      try {
        const response = await axios.get('http://api.timezonedb.com/v2.1/get-time-zone', {
          params: {
            key: this.API_KEY,
            format: 'json',
            by: 'zone',
            zone: zone
          }
        });

        if (response.data.status === 'OK') {
          const data = response.data;
          const datetime = new Date(data.formatted);
          
          return {
            timezone: data.zoneName,
            countryCode: data.countryCode,
            time: datetime.toLocaleTimeString('th-TH', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            }),
            date: datetime.toLocaleDateString('th-TH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            offset: this.formatOffset(data.gmtOffset),
            abbreviation: data.abbreviation
          };
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = 'ไม่สามารถดึงข้อมูลเวลาได้';
      } finally {
        this.loading = false;
      }
    },

    formatOffset(offset) {
      const hours = Math.floor(Math.abs(offset) / 3600);
      const minutes = Math.floor((Math.abs(offset) % 3600) / 60);
      const sign = offset >= 0 ? '+' : '-';
      return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    },

    formatZoneName(zone) {
      return zone.split('/').pop().replace(/_/g, ' ');
    },

    async updateAllTimes() {
      if (this.selectedZone) {
        this.currentTime = await this.fetchTimeForZone(this.selectedZone);
      }

      this.popularTimes = [];
      for (const zone of this.popularZones) {
        const time = await this.fetchTimeForZone(zone);
        if (time) this.popularTimes.push(time);
      }
    },

    async fetchAvailableZones() {
      try {
        const response = await axios.get('http://api.timezonedb.com/v2.1/list-time-zone', {
          params: {
            key: this.API_KEY,
            format: 'json'
          }
        });
        
        if (response.data.status === 'OK') {
          this.availableZones = response.data.zones.map(zone => zone.zoneName);
        }
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    }
  },

  async mounted() {
    await this.fetchAvailableZones();
    this.selectedZone = 'Asia/Bangkok';
    await this.updateAllTimes();
    setInterval(this.updateAllTimes, 60000);
  }
}
</script>

<style scoped>
.title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.globe-icon {
  font-size: 3rem;
  animation: rotate 20s linear infinite;
}

.select-container {
  max-width: 400px;
  margin: 0 auto 2rem;
}

.zone-select {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid rgba(25, 118, 210, 0.1);
  background: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.main-time-card {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  text-align: center;
}

.current-time {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.current-date {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.zone-name {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.zone-details {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.popular-times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.time-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.time-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.time-card.active {
  border: 2px solid #1976d2;
}

.time-card .time {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.time-card .date {
  color: #666;
  margin-bottom: 0.5rem;
}

.time-card .location {
  font-weight: 500;
  color: #1976d2;
}

.offset-badge {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
}

/* Dark Mode */
.dark-card {
  background: rgba(23, 32, 42, 0.95);
  color: white;
}

.dark-card .zone-select {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.dark-card .time-card {
  background: rgba(45, 55, 72, 0.9);
  color: white;
}

.dark-card .time-card .date {
  color: #aaa;
}

.dark-card .time-card .location {
  color: #90caf9;
}

.dark-card .offset-badge {
  background: rgba(144, 202, 249, 0.1);
  color: #90caf9;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```