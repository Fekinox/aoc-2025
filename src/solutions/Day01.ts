import type { SolverCollection } from "./types";

const day01: SolverCollection = new Map();

function Main(text: string) {
  const lines = text.split("\n");

  let st = 50;
  let pwS = 0;
  let pwG = 0;

  for (const line of lines) {
    if (line == "") {
      continue;
    }
    const d = line.slice(0, 1);
    let amt = parseInt(line.slice(1));

    let newSt = 0;

    // each turn in any direction by 100 will pass it by 0 once;
    // update the gold count accordingly
    pwG += Math.floor(amt / 100);
    amt = amt % 100;

    if (d == "R") {
      newSt = st + amt;
      // did we overshoot a right turn?
      if (newSt >= 100) {
        pwG++;
        // did we hit it exactly?
        if (newSt == 100) {
          pwS++;
        }
        newSt -= 100;
      }
    } else {
      newSt = st - amt;
      // did we overshoot a left turn?
      if (newSt <= 0) {
        // need this condition to handle the edge case when you start at 0
        // and turn left
        if (st != 0) {
          pwG++;
        }
        // did we hit it exactly?
        if (newSt == 0) {
          pwS++;
        } else {
          newSt += 100;
        }
      }
    }

    st = newSt;
  }

  return {
    silver: pwS.toString(),
    gold: pwG.toString(),
  };
}

day01.set("main", Main);

export default day01;
