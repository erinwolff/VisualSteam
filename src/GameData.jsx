import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Papa from 'papaparse';
import GameModal from './GameModal';


export default function GameData() {
  const [gameData, setGameData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const timeoutRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);



  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('../games.csv');
        const text = await response.text();


        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const randomIndex = Math.floor(Math.random() * results.data.length - 9);
            setGameData(results.data);
            setFilteredGames(results.data.slice(randomIndex, randomIndex + 10));
          },

          error: (error) => {
            setError('There was an error parsing the CSV data.');
          }
        });
      } catch (error) {
        setError('There was an error fetching game data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;

    // Clear any existing timeout
    clearTimeout(timeoutRef.current);

    // Create a new timeout to call filtering
    timeoutRef.current = setTimeout(() => {
      doFiltering(value);
    }, 300); // Adjust the delay as needed
  };

  const doFiltering = (value) => {
    if (value === '') {
      const randomIndex = Math.floor(Math.random() * gameData.length - 9);
      setFilteredGames(gameData?.slice(randomIndex, randomIndex + 10))
    } else {
      setFilteredGames(gameData?.filter((g) =>
        g.Name?.toLowerCase().includes(value.toLowerCase())
      ))
    }
  };

  const shortenDescription = (desc) => {
    const maxLength = 80; // Adjust as needed
    return desc.length > maxLength ? desc.substring(0, maxLength) + "..." : desc;
  };

  const GameCardContainer = ({ displayGames }) => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 15 }}>
          {displayGames.map((game) => (
            <Grid key={game.AppID} xs={1} sm={3} md={3}>
              <h3>{game.Name}</h3>
              <p>Released: {game["Release date"]}</p>
              <a
                href={game.Website ? game.Website : game["Metacritic url"]}
                target="_blank"
                onClick={(e) => {
                  if (!game.Website && !game["Metacritic url"]) {
                    e.preventDefault();
                    alert("No website available for this game.");
                  }
                }}
              >
                <img src={game["Header image"]} alt={game.Name} />
              </a>
              <p>{shortenDescription(game["About the game"])}</p>
              <Button variant="contained" size="small" color="success" onClick={() => {
                setSelectedGame(game);
                setShowModal(true);
              }}>Read More</Button>
            </Grid>
          ))}
          {showModal && (
            <GameModal game={selectedGame} onClose={() => setShowModal(false)} />
          )}
        </Grid>
      </Box>
    );
  };


  return (
    <div>
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
      {isLoading && <p>Loading game data ...</p>}
      {error && <p>{error}</p>}
      {<GameCardContainer displayGames={filteredGames} />}
    </div>
  );
}

