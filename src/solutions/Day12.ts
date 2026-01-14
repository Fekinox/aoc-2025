import { Grid } from "../util/Grid";
import type { SolverCollection } from "./types";

const day12: SolverCollection = new Map();

function Main(text: string) {
  const groups = text.split("\n\n").map((s) => s.split("\n"));
  let silver = 0;
  const counts = [];

  for (let i = 0; i < groups.length - 1; i++) {
    const sh = Grid.gridFromStrings(...groups[i].slice(1));
    let c = 0;
    sh.iter((x, y, v) => {
      if (v === "#") {
        c++;
      }
    });
    counts.push(c);
  }
  for (const ln of groups[groups.length - 1]) {
    const [rect, rest] = ln.split(": ");
    const [rx, ry] = rect.split("x").map(Number);
    const shapeCounts = rest.split(" ").map(Number);
    let raw = 0;
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
      raw += shapeCounts[i] * counts[i];
      total += shapeCounts[i];
    }
    // Reject all boards for which the total area of the pieces exceeds the
    // dimensions of the board
    if (raw > rx * ry) {
      continue;
    }
    // Accept all boards for which all pieces can fit within a 3x3 square
    if (total * 9 <= 3 * Math.floor(rx / 3) * 3 * Math.floor(ry / 3) * 9) {
      silver += 1;
    }
  }
  return {
    silver: silver.toString(),
    gold: "Merry Christmas!",
  };
}

day12.set("main", Main);

export default day12;
