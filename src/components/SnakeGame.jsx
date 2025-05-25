import React, { useEffect, useState, useRef } from "react";

const BOARD_SIZE = 20;
const INITIAL_SPEED = 150;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);
  const [direction, setDirection] = useState("ArrowRight");
  const [nextDirection, setNextDirection] = useState("ArrowRight");
  const [food, setFood] = useState(getRandomPosition);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);

  const moveSnake = () => {
    setDirection(nextDirection); // Apply queued direction

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const move = DIRECTIONS[nextDirection];
      let newHead = { x: head.x + move.x, y: head.y + move.y };

      // Wrap around the board edges
      if (newHead.x < 0) newHead.x = BOARD_SIZE - 1;
      else if (newHead.x >= BOARD_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = BOARD_SIZE - 1;
      else if (newHead.y >= BOARD_SIZE) newHead.y = 0;

      // Check collision with self
      if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setIsGameOver(true);
        setGameOverReason("You ran into yourself!");
        return prevSnake; // don't update snake anymore
      }

      const hasEaten = newHead.x === food.x && newHead.y === food.y;
      const newSnake = [newHead, ...prevSnake];

      if (!hasEaten) {
        newSnake.pop();
      } else {
        // Generate new food not on snake
        let newFood;
        do {
          newFood = getRandomPosition();
        } while (
          newSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)
        );
        setFood(newFood);
        setScore((s) => s + 1);
      }

      return newSnake;
    });
  };

  // Game loop
  useEffect(() => {
    if (!isGameOver) {
      intervalRef.current = setInterval(moveSnake, INITIAL_SPEED);
      return () => clearInterval(intervalRef.current);
    }
  }, [nextDirection, isGameOver]);

  // Keyboard input
  useEffect(() => {
    const handleKey = (e) => {
      if (DIRECTIONS[e.key]) {
        setNextDirection((prev) => {
          const opposite = {
            ArrowUp: "ArrowDown",
            ArrowDown: "ArrowUp",
            ArrowLeft: "ArrowRight",
            ArrowRight: "ArrowLeft",
          };
          // Prevent 180-degree turn
          return e.key === opposite[direction] ? prev : e.key;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  const restart = () => {
    setSnake([
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ]);
    setDirection("ArrowRight");
    setNextDirection("ArrowRight");
    setFood(getRandomPosition());
    setIsGameOver(false);
    setGameOverReason("");
    setScore(0);
  };

  const renderCell = (x, y) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some(
      (seg, idx) => idx !== 0 && seg.x === x && seg.y === y
    );
    const isFood = food.x === x && food.y === y;

    let bgClass = "bg-transparent";
    if (isHead) bgClass = "bg-green-700";
    else if (isBody) bgClass = "bg-green-500";
    else if (isFood) bgClass = "bg-red-600";

    return (
      <div
        key={`${x}-${y}`}
        className={`w-6 h-6 border border-transparent ${bgClass} rounded-sm transition-colors duration-200`}
      />
    );
  };

  return (
    <div className="flex flex-col items-center mt-8 select-none">
      <h1 className="text-3xl font-bold mb-2">🐍 Snake Game</h1>
      <p className="mb-4 text-lg font-semibold">Score: {score}</p>

      <div
        className="grid bg-gray-900 rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          width: BOARD_SIZE * 24, // cell width * BOARD_SIZE
          height: BOARD_SIZE * 24,
          userSelect: "none",
        }}>
        {[...Array(BOARD_SIZE)].flatMap((_, y) =>
          [...Array(BOARD_SIZE)].map((_, x) => renderCell(x, y))
        )}
      </div>

      {isGameOver && (
        <div className="mt-6 text-center">
          <p className="text-red-500 text-xl font-bold">
            {gameOverReason || "Game Over!"}
          </p>
          <button
            onClick={restart}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
