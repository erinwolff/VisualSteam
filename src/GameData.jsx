import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import BarChart from './BarChart.jsx';


export default function GameData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [steamUserData, setSteamUserData] = useState({ response: { games: [] } });
  const [steamId, setSteamId] = useState('');
  const [sortedGames, setSortedGames] = useState([]);




  const fetchSteamData = async (steamId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:80/api/games?steamId=${steamId}`);
      const data = await response.json();
      setSteamUserData(data);
      setIsLoading(false);
      if (data?.response?.games?.length > 0 && sortedGames.length === 0) {
        data.response.games.sort((gameA, gameB) => gameB.playtime_forever - gameA.playtime_forever);
        const top10PlaytimeGames = data.response.games.slice(0, 10);
        setSortedGames(top10PlaytimeGames);
      }
    } catch (error) {
      console.log('Error fetching Steam data: ', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Normalize for case-insensitive search

    if (value === '') {
      setFilteredGames([]); // clear the search results
    } else {
      const newFilteredGames = steamUserData.response.games.filter((game) =>
        game.name?.toLowerCase().includes(value) // Search by 'name'
      );
      setFilteredGames(newFilteredGames);
    }
  };

  const GameCardContainer = ({ displayGames }) => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid className="game-container" container spacing={5} columns={{ xs: 1, sm: 1, md: 13 }}>
          {displayGames.map((game) => (
            <Grid className="game-card" key={game.appid} xs={1} sm={2} md={2}>
              <h3>{game.name}</h3>
              <h4>{Math.floor(game.playtime_forever / 60) === 0
                ? 'Less than an hour'
                : Math.floor(game.playtime_forever / 60) === 1
                  ? `${Math.floor(game.playtime_forever / 60)} hour`
                  : `${Math.floor(game.playtime_forever / 60)} hours`
              }
              </h4>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchSteamData(steamId); // Trigger data fetch with steamId
      setSteamId(''); // Clear the input field
    }
  };

  return (
    <div>
      <div className="search-bar">
        <TextField
          id="filled-search"
          label="Search Game Titles"
          type="search"
          variant="outlined"
          color="success"
          onChange={handleSearch}
        />
      </div>
      <div className="steam-id-input">
        <Tooltip placement="right-start" title="To find your Steam ID, visit your Steam User Profile. Your ID is the number at the end of your profile URL: https://steamcommunity.com/profiles/YOUR-STEAM-ID/">
          <TextField
            id="steam-id-input"
            label="Steam ID"
            type="input"
            variant="outlined"
            value={steamId}
            color="success"
            onChange={(e) => setSteamId(e.target.value)}
            onKeyDown={handleKeyDown}
            helperText="Press ENTER to submit"
          />
        </Tooltip>
      </div>
      {isLoading && <p>Loading game data ...</p>}
      {error && <p>{error}</p>}
      <br />
      <div className="chart-container">
        {filteredGames.length > 0 ? (
          <BarChart filteredGames={filteredGames} />
        ) : (
          <BarChart filteredGames={sortedGames} />
        )}
      </div>
      <br />
      <br />
      <br />
      <h3>User Stats</h3>
      <p>Total Games Owned: {steamUserData.response.game_count}</p>
      <br />
      <br />
      {steamUserData && filteredGames.length > 0 && (
        <GameCardContainer displayGames={filteredGames} />
      )
      }
    </div>
  );
}


// get steam username, show more data using more endpoints