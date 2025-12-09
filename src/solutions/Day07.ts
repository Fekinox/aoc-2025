import { Grid } from "../util/Grid";
import type { SolverCollection } from "./types";

const day07: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;
  const grid = Grid.gridFromStrings(...text.split("\n"));
  console.log(grid);

  let start = 0;
  for (let i = 0; i < grid.width; i++) {
    if (grid.mustGet(i, 0) === "S") {
      start = i;
    }
  }
  let tachyons: Set<number> = new Set([start]);

  for (let y = 1; y < grid.height; y++) {
    const newTachys: Set<number> = new Set();
    for (const t of tachyons) {
      if (grid.mustGet(t, y) === "^") {
        silver += 1;
        newTachys.add(t - 1);
        newTachys.add(t + 1);
      } else {
        newTachys.add(t);
      }
    }
    tachyons = newTachys;
  }

  const matrix: Grid<number> = Grid.makeGrid(grid.width, grid.height, 0);
  for (let y = grid.height - 1; y >= 0; y--) {
    for (let x = 0; x < grid.width; x++) {
      if (y === grid.height - 1) {
        matrix.set(x, y, 1);
      } else if (y !== 0) {
        if (grid.mustGet(x, y) === "^") {
          matrix.set(
            x,
            y,
            matrix.mustGet(x - 1, y + 1) + matrix.mustGet(x + 1, y + 1),
          );
        } else {
          matrix.set(x, y, matrix.mustGet(x, y + 1));
        }
      } else {
        if (grid.mustGet(x, y) === "S") {
          gold = matrix.mustGet(x, y + 1);
        }
      }
    }
  }

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day07.set("main", Main);

export default day07;
