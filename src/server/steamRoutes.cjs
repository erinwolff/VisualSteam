// ./api/steamRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/games', async (req, res) => {
  try {
    const STEAM_ID = process.env.STEAM_ID;
    const apiKey = process.env.STEAM_API_KEY;

    const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${STEAM_ID}&format=json&include_appinfo=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Steam data:', error); 
    // More specific error handling
    if (error.response && error.response.status === 401) {
      res.status(401).json({ error: 'Invalid or missing Steam API Key' });
    } else {
      res.status(500).json({ error: 'Failed to fetch Steam data' });
    }
  }
});

module.exports = router;