import React from "react";
import produce from "immer";

import "./App.css";

const numRows = 50;
const numCols = 50;
const speed = 500;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const generateRandomGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }

  return rows;
};

const toggleGrid = (grid: number[][], i: number, k: number) => {
  const newGrid = produce(grid, (gridCopy) => {
    gridCopy[i][k] = grid[i][k] ? 0 : 1;
  });

  return newGrid;
};

const countNeighbors = (grid: number[][], x: number, y: number) => {
  return operations.reduce((acc, [i, k]) => {
    const row = (x + i + numRows) % numRows;
    const col = (y + k + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

const App: React.FC = () => {
  const [grid, setGrid] = React.useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = React.useState(false);

  const runningRef = React.useRef(running);
  runningRef.current = running;

  const runSimulation = React.useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            const neighbors = countNeighbors(g, i, k);

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    // simulate
    setTimeout(runSimulation, speed);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);

          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateRandomGrid);
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_, k) => (
            <div
              className="box__size"
              key={`${i}-${k}`}
              onClick={() => {
                setGrid(toggleGrid(grid, i, k));
              }}
              style={{
                backgroundColor: grid[i][k] ? "#45e" : undefined,
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
