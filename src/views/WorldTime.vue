<template>
    <div class="container world-time-container">
        <div class="card shadow-lg p-4" :class="darkMode ? 'dark-card' : 'light-card'">
            <h1 class="mb-4 text-center">
                <span class="title-icon">🌐</span> World Time
            </h1>

            <!-- Time Zone Selector -->
            <div class="search-container mb-4">
                <select v-model="selectedTimezone" class="form-select timezone-select" @change="fetchTimeForZone">
                    <option value="">เลือกเมือง/ประเทศ</option>
                    <option v-for="zone in timezones" :key="zone" :value="zone">
                        {{ formatTimezoneName(zone) }}
                    </option>
                </select>
            </div>

            <!-- Current Time Display -->
            <div class="time-display" v-if="currentTime">
                <div class="time-card">
                    <div class="time">{{ currentTime.formatted }}</div>
                    <div class="date">{{ currentTime.date }}</div>
                    <div class="location">{{ formatTimezoneName(currentTime.timezone) }}</div>
                </div>
            </div>

            <!-- Popular Timezones -->
            <div class="popular-times mt-4">
                <h3 class="text-center mb-3">เวลายอดนิยม</h3>
                <div class="row g-3">
                    <div v-for="(time, index) in popularTimes" :key="index" class="col-md-4">
                        <div class="time-card small">
                            <div class="location">{{ formatTimezoneName(time.timezone) }}</div>
                            <div class="time">{{ time.time }}</div>
                            <div class="date small">{{ time.date }}</div>
                        </div>
                    </div>
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
            selectedTimezone: '',
            currentTime: null,
            timezones: [],
            popularTimes: [],
            popularZones: [
                'Asia/Bangkok',
                'America/New_York',
                'Europe/London',
                'Asia/Tokyo',
                'Australia/Sydney',
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
        async fetchTimezones() {
            try {
                const response = await axios.get('http://worldtimeapi.org/api/timezone');
                this.timezones = response.data;
            } catch (error) {
                console.error('Error fetching timezones:', error);
            }
        },

        async fetchTimeForZone(zone = 'Asia/Bangkok') {
            try {
                const response = await axios.get(`http://worldtimeapi.org/api/timezone/${zone || this.selectedTimezone}`);
                const data = response.data;

                this.currentTime = {
                    timezone: data.timezone,
                    formatted: new Date(data.datetime).toLocaleTimeString('th-TH'),
                    date: new Date(data.datetime).toLocaleDateString('th-TH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                };
            } catch (error) {
                console.error('Error fetching time:', error);
            }
        },

        async fetchPopularTimes() {
            for (const zone of this.popularZones) {
                try {
                    const response = await axios.get(`http://worldtimeapi.org/api/timezone/${zone}`);
                    const data = response.data;

                    this.popularTimes.push({
                        timezone: zone,
                        time: new Date(data.datetime).toLocaleTimeString('th-TH'),
                        date: new Date(data.datetime).toLocaleDateString('th-TH', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })
                    });
                } catch (error) {
                    console.error(`Error fetching time for ${zone}:`, error);
                }
            }
        },

        formatTimezoneName(zone) {
            return zone.replace('_', ' ').replace('/Asia/Bangkok', 'Bangkok, Thailand');
        },

        startClock() {
            setInterval(() => {
                this.updateTimes();
            }, 1000);
        },

        updateTimes() {
            this.popularTimes = this.popularTimes.map(time => ({
                ...time,
                time: new Date(new Date().toLocaleString('en-US', { timeZone: time.timezone })).toLocaleTimeString('th-TH')
            }));

            if (this.currentTime) {
                this.currentTime.formatted = new Date(new Date().toLocaleString('en-US', { timeZone: this.currentTime.timezone })).toLocaleTimeString('th-TH');
            }
        }
    },
    async mounted() {
        await this.fetchTimezones();
        await this.fetchTimeForZone();
        await this.fetchPopularTimes();
        this.startClock();
    }
}
</script>

<style scoped>
.world-time-container {
    padding: 2rem;
}

.title-icon {
    font-size: 2.5rem;
    margin-right: 0.5rem;
    animation: rotate 20s linear infinite;
}

.timezone-select {
    max-width: 400px;
    margin: 0 auto;
    height: 3rem;
    border-radius: 10px;
}

.time-display {
    text-align: center;
    margin: 2rem 0;
}

.time-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.time-card:hover {
    transform: translateY(-5px);
}

.time-card.small {
    padding: 1rem;
}

.time {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.time-card.small .time {
    font-size: 1.5rem;
}

.date {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.location {
    font-size: 1.1rem;
    font-weight: 500;
    color: #1976d2;
}

/* Dark mode */
.dark-card {
    background: rgba(23, 32, 42, 0.95);
    color: white;
}

.dark-card .time-card {
    background: rgba(45, 55, 72, 0.9);
}

.dark-card .date {
    color: #aaa;
}

.dark-card .location {
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
</style>