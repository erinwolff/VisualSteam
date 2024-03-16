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
    console.error('Error fetching Owned Games summary:', error);
    console.error('Error Response:', error.response);
    res.status(500).json({ error: 'Failed to fetch Owned Games summary' });
  }
});

router.get('/userSummary', async (req, res) => {
  try {
    const STEAM_ID = req.query.steamId
    const apiKey = process.env.STEAM_API_KEY;

    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${STEAM_ID}&format=json&include_appinfo=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Steam user summary:', error);
    console.error('Error Response:', error.response);
    res.status(500).json({ error: 'Failed to fetch Steam user summary' });
  }
});

router.get('/recentlyPlayedGames', async (req, res) => {
  try {
    const STEAM_ID = req.query.steamId
    const apiKey = process.env.STEAM_API_KEY;

    const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${STEAM_ID}&format=json`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Recently Played Games summary:', error);
    console.error('Error Response:', error.response);
    res.status(500).json({ error: 'Failed to fetch Recently Played Games summary' });
  }
});

module.exports = router;