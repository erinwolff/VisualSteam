const router = require("express").Router();
const axios = require('axios');

router.get('/games', async (req, res) => {
  try {
    const STEAM_ID = req.query.steamId 
    const apiKey = process.env.STEAM_API_KEY;

    const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${STEAM_ID}&format=json&include_appinfo=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    // ... error handling
  }
});

module.exports = router;