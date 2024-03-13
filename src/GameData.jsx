import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import BarChart from './BarChart.jsx';
import Button from '@mui/material/Button';

function getRandomGames(gamesArray, count = 15) {
  const shuffled = gamesArray.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffled.slice(0, count);
}



export default function GameData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [steamUserData, setSteamUserData] = useState({ response: { games: [] } });
  const [randomGames, setRandomGames] = useState([]);

  const refreshRandomGames = () => {
    const randomSelection = getRandomGames(steamUserData.response.games);
    setRandomGames(randomSelection);
  };


  useEffect(() => {
    const fetchSteamData = async () => {
      try {
        const response = await fetch('http://localhost:80/api/games');
        const data = await response.json();
        setSteamUserData(data);
        setIsLoading(false);
        if (data?.response?.games?.length > 0 && randomGames.length === 0) {
          const randomSelection = getRandomGames(data.response.games);
          setRandomGames(randomSelection);
        }
      } catch (error) {
        console.log('Error fetching Steam data: ', error);
      }
    };
    fetchSteamData();
  }, []);


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Normalize for case-insensitive search

    if (value === '') {
      setFilteredGames(randomGames); // Reset to full game list
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
        <h1>Playtime</h1>
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

  return (
    <div>
      <Button variant="outlined" color="secondary" size="small" sx={{ margin: '10px' }} onClick={refreshRandomGames}>Refresh</Button>
      <div className="search-bar">
        <TextField
          id="filled-search"
          label="Search field"
          type="search"
          variant="outlined"
          color="success"
          onChange={handleSearch}
        />
      </div>
      <div className="chart-container">
        {filteredGames.length > 0 ? (
          <BarChart filteredGames={filteredGames} />
        ) : (
          <BarChart filteredGames={randomGames} />
        )}
      </div>
      {isLoading && <p>Loading game data ...</p>}
      {error && <p>{error}</p>}
      {steamUserData &&
        (filteredGames.length > 0
          ? <GameCardContainer displayGames={filteredGames} />  // Show filtered results
          : <GameCardContainer displayGames={randomGames} />// Only show games with playtime >= 30 hours
        )
      }
    </div>
  );
}

// add input to allow other users to input their steamid 