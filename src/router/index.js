import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import WeatherThailand from '@/views/WeatherThailand.vue';
import News from '@/views/News.vue';
import Ai from '@/views/Ai.vue'; // ✅ เพิ่ม AI Chat
import WorldTime from '@/views/WorldTime.vue';
import Ai2 from '../views/Ai2.vue';

const routes = [
  { path: "/", component: Home },
  { path: "/weatherthailand", component: WeatherThailand },
  { path: "/news", component: News },
  { path: "/chat-ai", component: Ai },
  { path: "/chat-ai1", component: Ai2 },
  { path: "/world-time", component: WorldTime },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
