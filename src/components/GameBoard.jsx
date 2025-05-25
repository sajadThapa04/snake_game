import React from "react";

const GameBoard = ({ boardSize, snake, food, cellSize }) => {
  const renderCell = (x, y) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some((seg) => seg.x === x && seg.y === y);
    const isFood = food.x === x && food.y === y;

    let style = {
      width: cellSize,
      height: cellSize,
      transition: "background-color 0.2s ease",
      borderRadius: "4px",
    };

    if (isHead) {
      style.background = "linear-gradient(135deg, #00ff00, #008000)";
      style.boxShadow = "0 0 10px 2px #00ff00";
    } else if (isBody) {
      style.background = "linear-gradient(135deg, #228B22, #006400)";
      style.boxShadow = "inset 0 0 5px #004d00";
    } else if (isFood) {
      style.background = "radial-gradient(circle at center, #ff4444, #aa0000)";
      style.boxShadow = "0 0 8px 3px #ff0000";
      style.borderRadius = "50%"; // make food round
    } else {
      style.background = "transparent";
    }

    return <div key={`${x}-${y}`} style={style}></div>;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
        gap: 0,
        backgroundColor: "#111", // dark background for contrast
        borderRadius: "12px",
        padding: "8px",
        boxShadow: "0 0 20px #222 inset",
        userSelect: "none",
      }}>
      {[...Array(boardSize)].flatMap((_, y) =>
        [...Array(boardSize)].map((_, x) => renderCell(x, y))
      )}
    </div>
  );
};

export default GameBoard;
