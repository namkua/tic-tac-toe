import React from "react";

export default function GameInfo({ status, onNewGame, aiLevel, setAiLevel, scores, streak, metrics, thinking }) {
  return (
    <div className="info">
      <div className="section">
        <div className="kv">
          <div>Status</div>
          <div>{status}</div>
        </div>
        <div className="controls" style={{ marginTop: 10 }}>
          <button className="btn" onClick={onNewGame}>New Game</button>
          <button className={`btn ${aiLevel === "easy" ? "primary" : ""}`} onClick={() => setAiLevel("easy")}>Easy</button>
          <button className={`btn ${aiLevel === "hard" ? "primary" : ""}`} onClick={() => setAiLevel("hard")}>Hard</button>
        </div>
      </div>

      <div className="section">
        <div className="kv">
          <div>Score (You / AI / Draw)</div>
          <div>{scores.player} / {scores.ai} / {scores.draw}</div>
        </div>
        <div className="kv" style={{ marginTop: 8 }}>
          <div>Current streak</div>
          <div className="streak">{streak}</div>
        </div>
      </div>

      <div className="section">
        <div className="kv"><div>Performance</div><div/></div>
        <div className="metrics">
          Positions evaluated: {metrics.positionsEvaluated}<br/>
          AI thinking: {thinking} ms
        </div>
      </div>

      <div className="section" style={{ fontSize: 13, color: "#9fb0c9" }}>
        <strong>How AI works</strong>
        <div style={{ marginTop: 6 }}>
          Easy: random moves, sometimes misses blocks. <br/>
          Hard: minimax (unbeatable). Console logs evaluations.
        </div>
      </div>
    </div>
  );
}
