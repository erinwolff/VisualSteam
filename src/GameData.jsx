import React, { useState } from 'react';
import { Pagination, TextField, Tooltip, Box, Grid, Card } from '@mui/material';

import BarChart from './BarChart.jsx';
import DoughnutChart from './DoughnutChart.jsx';

import Bart from './assets/bart.gif';



export default function GameData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);
  const [ownedGamesData, setOwnedGamesData] = useState({ response: { games: [] } });
  const [userSummary, setUserSummary] = useState({ response: { players: [] } });
  const [recentlyPlayedGamesData, setRecentlyPlayedGamesData] = useState({ response: { games: [] } });
  const [steamId, setSteamId] = useState('');
  const [sortedGames, setSortedGames] = useState([]);
  const [page, setPage] = useState(1);

  const fetchOwnedGamesData = async (steamId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:80/api/games?steamId=${steamId}`);
      const data = await response.json();
      setOwnedGamesData(data);
      setIsLoading(false);
      if (data?.response?.games?.length > 0) {
        data.response.games.sort((gameA, gameB) => gameB.playtime_forever - gameA.playtime_forever);
        const top10PlaytimeGames = data.response.games.slice(0, 10);
        setSortedGames(top10PlaytimeGames);
      }
    } catch (error) {
      console.error('Error fetching Recently Played Games summary:', error);
    }
  };

  const fetchSteamUserSummary = async (steamId) => {
    try {
      const response = await fetch(`http://localhost:80/api/userSummary?steamId=${steamId}`);
      const data = await response.json();
      setUserSummary(data);
    } catch (error) {
      console.error('Error fetching Recently Played Games summary:', error);
    }
  }

  const fetchRecentlyPlayedGamesData = async (steamId) => {
    try {
      const response = await fetch(`http://localhost:80/api/recentlyPlayedGames?steamId=${steamId}`);
      const data = await response.json();
      setRecentlyPlayedGamesData(data);
    } catch (error) {
      console.error('Error fetching Recently Played Games summary:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Normalize for case-insensitive search

    if (value === '') {
      setFilteredGames([]); // clear the search results
    } else {
      const newFilteredGames = ownedGamesData.response.games.filter((game) =>
        game.name?.toLowerCase().includes(value) // Search by 'name'
      );
      setFilteredGames(newFilteredGames);
    }
  };

  const GameCardContainer = ({ displayGames }) => {
    const GAMES_PER_PAGE = 20;

    const startIndex = (page - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const currentGames = displayGames.slice(startIndex, endIndex);

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid className="game-container" container spacing={5} columns={{ xs: 1, sm: 1, md: 13 }}>
          {currentGames.map((game) => (
            <Card className="game-card" key={game.appid} sx={{ backgroundColor: '#FFE6E6', border: '1px solid #7469B6' }}>
              <h3>{game.name}</h3>
              <h4>{Math.floor(game.playtime_forever / 60) === 0
                ? 'Less than an hour'
                : Math.floor(game.playtime_forever / 60) === 1
                  ? `${Math.floor(game.playtime_forever / 60)} hour`
                  : `${Math.floor(game.playtime_forever / 60)} hours`
              }
              </h4>
            </Card>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(displayGames.length / GAMES_PER_PAGE)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="secondary"
          size="large"
          className="pagination"
          showFirstButton
          showLastButton
        />
      </Box>
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSortedGames([]); // Clear the sorted games
      fetchOwnedGamesData(steamId); // Trigger data fetch with steamId
      fetchSteamUserSummary(steamId);
      fetchRecentlyPlayedGamesData(steamId);
      setSteamId(''); // Clear the input field
    }
  };

  return (
    <div>
      <h1>Visual Steam</h1>
      <div className="steam-id-input">
        <Tooltip placement="right-start" title="To find your Steam ID, visit your Steam User Profile. Your ID is the number at the end of your profile URL: https://steamcommunity.com/profiles/YOUR-STEAM-ID/">
          <TextField
            id="steam-id-input"
            label="Steam ID"
            type="input"
            variant="outlined"
            value={steamId}
            color="secondary"
            onChange={(e) => setSteamId(e.target.value)}
            onKeyDown={handleKeyDown}
            helperText="Press ENTER to submit"
          />
        </Tooltip>
      </div>
      {isLoading && <p>Loading game data ...</p>}
      {error && <p>{error}</p>}
      <br />
      {userSummary.response.players.length > 0 ? (
        <>
          <Tooltip placement="left" title="View Steam profile">
            <a href={userSummary.response.players[0].profileurl} target="_blank" rel="noreferrer">
              <img src={userSummary.response.players[0].avatarmedium} alt="User Avatar" className="avatar" />
            </a>
          </Tooltip>
          <h2>{userSummary.response.players[0].personaname}'s Stats</h2>
          <img src={Bart} alt="walking_soldier" />
          <br />
          <br />
          <div className="chart-container">
            <h2>Top 10 Most Played</h2>
            <br />
            <BarChart filteredGames={sortedGames} />
            <br />
            <h2>Played in the Last Two Weeks</h2>
            <br />
            <DoughnutChart recentlyPlayedGamesData={recentlyPlayedGamesData} />
            <br />
          </div>
          <br />
          <br />
          <h2>Total Games Owned: {ownedGamesData.response.game_count}</h2>
          <br />
          <div className="search-bar">
            <TextField
              id="search-bar"
              label="Search Owned Games"
              type="search"
              variant="outlined"
              color="secondary"
              onChange={handleSearch}
            />
          </div>
          <br />
          <br />
          {(filteredGames.length > 0) ? (
            <GameCardContainer displayGames={filteredGames} />
          ) : (
            <GameCardContainer displayGames={ownedGamesData.response.games} />
          )
          }
        </>
      ) : (
        <p>Submit your Steam ID to view your stats!</p>
      )}
    </div>
  );
}


