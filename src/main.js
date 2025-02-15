import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Import Bootstrap JS
import "animate.css";

// ตรวจสอบการโหลดตัวแปร environment
console.log('VITE_HUGGING_FACE_TOKEN:', import.meta.env.VITE_HUGGING_FACE_TOKEN);
console.log('VITE_NEWS_TOKEN:', import.meta.env.VITE_NEWS_TOKEN);

const app = createApp(App);
app.use(router);
app.mount("#app");