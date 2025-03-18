import React, { useState, useRef } from 'react';

// Grid dimensions
const numRows = 30;
const numCols = 50;

// Helper function to create an empty grid
const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

// Helper function to create a random grid
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() < 0.3 ? 1 : 0)));
  }
  return rows;
};

function GameOfLife() {
  const [grid, setGrid] = useState(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  // Simulation speed control state (in milliseconds)
  const [simulationDelay, setSimulationDelay] = useState(100);
  const simulationDelayRef = useRef(simulationDelay);
  simulationDelayRef.current = simulationDelay;

  // Simulation function to update the grid
  const runSimulation = () => {
    if (!runningRef.current) return;
    setGrid(g =>
      g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          // Define the 8 neighboring directions
          const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
          ];
          directions.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });
          // Apply Conway's rules:
          // 1. Underpopulation or overpopulation: live cell dies.
          // 2. Reproduction: dead cell becomes live if it has exactly 3 neighbors.
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      )
    );
    // Use the current simulation delay for the next update
    setTimeout(runSimulation, simulationDelayRef.current);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {/* Start/Stop Button */}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
          style={{ marginLeft: '10px' }}
        >
          Reset
        </button>

        {/* Randomize Button */}
        <button
          onClick={() => {
            setGrid(generateRandomGrid());
          }}
          style={{ marginLeft: '10px' }}
        >
          Randomize
        </button>

        {/* Simulation Speed Control */}
        <div style={{ marginTop: '10px' }}>
          <label>
            Simulation Speed (ms): {simulationDelay}
            <input
              type="range"
              min="10"
              max="1000"
              value={simulationDelay}
              onChange={(e) => {
                const newDelay = Number(e.target.value);
                setSimulationDelay(newDelay);
                simulationDelayRef.current = newDelay;
              }}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
      </div>

      {/* Grid Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                // Toggle the cell state on click
                const newGrid = grid.map((r, rowIndex) =>
                  r.map((c, colIndex) => {
                    if (rowIndex === i && colIndex === j) {
                      return c ? 0 : 1;
                    }
                    return c;
                  })
                );
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell ? 'black' : undefined,
                border: 'solid 1px gray',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GameOfLife;

