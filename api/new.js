const axios = require('axios');

module.exports = async (req, res) => {
  const apiKey = process.env.VITE_NEWS_TOKEN;
  const url = `https://newsapi.org/v2/everything?q=weather OR storm OR flood OR climate OR typhoon OR tornado&language=en&pageSize=10&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message 
    });
  }
};