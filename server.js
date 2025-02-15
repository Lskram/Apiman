const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/news", async (req, res) => {
  try {
    const apiKey = "ee171af9bae54139a44694fa61bcb9d9"; // API Key ของคุณ
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=th&apiKey=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถโหลดข่าวได้" });
  }
});

app.listen(3001, () => console.log("เซิร์ฟเวอร์กำลังทำงานที่พอร์ต 3001"));
