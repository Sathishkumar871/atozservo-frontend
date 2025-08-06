import React from "react";

interface GamesProps {
  onClick?: () => void;
}

const Games: React.FC<GamesProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-40 h-40 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
    >
      🎮 Play Games
    </button>
  );
};

export default Games;
