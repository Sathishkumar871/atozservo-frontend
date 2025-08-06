import React from "react";
import './GameDesign.css';
import BattleLink from "./BattleLink";

const GameDesign: React.FC = () => {
  return (
    <div className="game-design-container">
     
      <div id="battle-scroll">
        <BattleLink />
      </div>
    </div>
  );
};

export default GameDesign;
