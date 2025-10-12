import React from "react";
import Square from "./Square";

export default function Board({ board, onPlay, winLine, disabled }) {
  return (
    <div className="board-card">
      <div className="board" role="grid">
        {board.map((val, idx) => (
          <Square
            key={idx}
            value={val}
            onClick={() => !disabled && onPlay(idx)}
            highlighted={winLine && winLine.includes(idx)}
            disabled={disabled || val !== null}
          />
        ))}
      </div>
    </div>
  );
}
