import React from 'react';
import Button from '@mui/material/Button';

const GameModal = ({ game, onClose }) => {
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <h2>{game.Name}</h2>
        <p>{game["About the game"]}</p> {/* Displays the full description */}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default GameModal; 