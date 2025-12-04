import type { SolverCollection } from "./types";
import { Grid } from "../util/Grid";

const day04: SolverCollection = new Map();

function Main(text: string) {
  const gd = Grid.gridFromStrings(...text.split("\n"));

  let silver = 0;
  let gold = 0;

  for (let y = 0; y < gd.height; y++) {
    for (let x = 0; x < gd.width; x++) {
      const nbhd = gd.neighborhood(x, y, 1, false);
      let count = 0;
      if (gd.mustGet(x, y) == "@") {
        for (const entry of nbhd) {
          if (entry.value == "@" || entry.value == "x") {
            count++;
          }
        }
        if (count < 4) {
          silver++;
        }
      }
    }
  }

  while (true) {
    let removed = 0;
    for (let y = 0; y < gd.height; y++) {
      for (let x = 0; x < gd.width; x++) {
        const nbhd = gd.neighborhood(x, y, 1, false);
        let count = 0;
        if (gd.mustGet(x, y) == "@") {
          for (const entry of nbhd) {
            if (entry.value == "@") {
              count++;
            }
          }
          if (count < 4) {
            gd.set(x, y, ".");
            removed++;
          }
        }
      }
    }

    if (removed === 0) {
      break;
    }
    gold += removed;
  }

  console.log(gd.data);
  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

function Washed(text: string) {
  const gd = Grid.gridFromStrings(...text.split("\n"));

  let silver = 0;
  let gold = 0;

  for (let y = 0; y < gd.height; y++) {
    for (let x = 0; x < gd.width; x++) {
      const nbhd = gd.neighborhood(x, y, 1, false);
      let count = 0;
      if (gd.mustGet(x, y) == "@") {
        for (const entry of nbhd) {
          if (entry.value == "@") {
            count++;
          }
        }
        if (count < 4) {
          silver++;
          gd.set(x, y, ".");
        }
      }
    }
  }

  while (true) {
    let removed = 0;
    for (let y = 0; y < gd.height; y++) {
      for (let x = 0; x < gd.width; x++) {
        const nbhd = gd.neighborhood(x, y, 1, false);
        let count = 0;
        if (gd.mustGet(x, y) == "@") {
          for (const entry of nbhd) {
            if (entry.value == "@") {
              count++;
            }
          }
          if (count < 4) {
            gd.set(x, y, ".");
            removed++;
          }
        }
      }
    }

    if (removed === 0) {
      break;
    }
    gold += removed;
  }

  console.log(gd.data);
  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day04.set("main", Main);
day04.set("washed", Washed);

export default day04;
