export const weatherIcons = {
    cloudy: '/weather-icons/animated/cloudy1.svg',
    rainy: '/weather-icons/animated/rainy1.svg',
    thunder: '/weather-icons/animated/thunder.svg',
    // ... เพิ่มไอคอนอื่นๆ
  }
  
  export function getWeatherIcon(condition) {
    return weatherIcons[condition] || '/weather-icons/static/weather.svg';
  }