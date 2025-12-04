import type { SolverCollection } from "./types";

const day03: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;
  for (const line of text.split("\n")) {
    // table[l][b]: maximum joltage attainable on a l-length prefix of array
    // using b batteries
    const table = Array.from({ length: line.length + 1 }, (_, l) =>
      Array.from({ length: 13 }, (_, b) => {
        // if b is 0, joltage is 0
        if (b === 0) {
          return 0;
        }
        // if more batteries than length of prefix, should be impossible
        if (b > l) {
          return -1;
        }
        // if num batteries exactly length of prefix, should just be the
        // prefix
        if (b === l) {
          return Number(line.slice(0, l));
        }
        // otherwise return 0
        return undefined;
      }),
    );

    for (let l = 0; l <= line.length; l++) {
      for (let b = 0; b <= 12; b++) {
        if (table[l][b] === undefined) {
          const usedBattery = table[l - 1][b - 1]!;
          const didntUseBattery = table[l - 1][b]!;
          let usedBatteryJoltage = usedBattery;
          if (usedBattery !== -1) {
            usedBatteryJoltage = usedBattery * 10 + Number(line[l - 1]);
          }
          if (usedBattery === -1 && didntUseBattery === -1) {
            table[l][b] = -1;
          } else if (usedBattery === -1) {
            table[l][b] = didntUseBattery;
          } else if (didntUseBattery === -1) {
            table[l][b] = usedBatteryJoltage;
          } else {
            table[l][b] = Math.max(didntUseBattery, usedBatteryJoltage);
          }
        }
      }
    }

    if (table[line.length][12] !== undefined) {
      gold += table[line.length][12];
    }

    if (table[line.length][2] !== undefined) {
      silver += table[line.length][2];
    }
  }
  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

function Greedy(text: string) {
  let silver = 0;
  let gold = 0;
  for (const line of text.split("\n")) {
    let sl = Array.from(line).map(Number);
    let s = 0;
    let gl = Array.from(line).map(Number);
    let g = 0;

    // part 1
    for (let c = 0; c < 2; c++) {
      let max = sl[0];
      let maxIdx = 0;
      for (let j = 1; j < sl.length - (1 - c); j++) {
        if (sl[j] > max) {
          max = sl[j];
          maxIdx = j;
        }
      }
      s = 10 * s + max;
      sl = sl.slice(maxIdx + 1);
    }

    // part 2
    for (let c = 0; c < 12; c++) {
      let max = gl[0];
      let maxIdx = 0;
      for (let j = 1; j < gl.length - (11 - c); j++) {
        if (gl[j] > max) {
          max = gl[j];
          maxIdx = j;
        }
      }
      g = 10 * g + max;
      gl = gl.slice(maxIdx + 1);
    }

    silver += s;
    gold += g;
  }
  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day03.set("main", Main);
day03.set("greedy", Greedy);

export default day03;
