import React, { useState } from 'react';
// import PlayerSelectForm from './PlayerSelectForm';
// import PlayerStatsBlock from './PlayerStatsBlock';

function NhlStats() {
  const [playerOne, setPlayerOne] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);
  return (
    <div className="NhlStats">
      <h1>NHL Fantasy Draft </h1>
      {/* <div className="row">
        <div className="col">
          { playerOne 
            ? <PlayerStatsBlock
                playerId = {playerOne}
              />
            : <PlayerSelectForm
                playerId = {playerOne}
                setPlayerId = {setPlayerOne}
              />
          }  
        </div>
        <div className="col">
          { playerOne 
            ? <PlayerStatsBlock
                playerId = {playerTwo}
              />
            : <PlayerSelectForm
                playerId = {playerTwo}
                setPlayerId = {setPlayerTwo}
              />
          }
        </div>
      </div> */}
    </div>
  );
}

export default NhlStats;
