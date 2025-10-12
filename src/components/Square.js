import React from "react";

export default function Square({ value, onClick, highlighted, disabled }) {
  const cls = ["square"];
  if (value === "X") cls.push("x");
  if (value === "O") cls.push("o");
  if (highlighted) cls.push("win");
  if (disabled) cls.push("disabled");

  return (
    <div className={cls.join(" ")} onClick={onClick} role="button" aria-label={`square-${value ?? "empty"}`}>
      {value}
    </div>
  );
}
