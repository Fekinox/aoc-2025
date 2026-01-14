// TODO: maybe switch to z3?
import solver from "javascript-lp-solver";
import type { SolverCollection } from "./types";

const day10: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;
  for (const ln of text.split("\n")) {
    const fields = ln.split(" ");
    const lights = fields[0].slice(1, -1);
    const buttons = fields
      .slice(1, -1)
      .map((f) => f.slice(1, -1).split(",").map(Number));
    const joltage = fields[fields.length - 1]
      .slice(1, -1)
      .split(",")
      .map(Number);

    const agQueue = [
      {
        lights: Array.from(lights, () => ".").join(""),
        used: new Set<number>(),
        presses: 0,
      },
    ];

    while (agQueue.length !== 0) {
      const top = agQueue.shift();
      if (top === undefined) break;
      if (top.lights === lights) {
        silver += top.presses;
        break;
      }
      for (let i = 0; i < buttons.length; i++) {
        if (top.used.has(i)) continue;
        const newSet = new Set(top.used);
        newSet.add(i);
        const newLights = Array.from(top.lights);
        for (const bt of buttons[i]) {
          newLights[bt] = newLights[bt] === "#" ? "." : "#";
        }
        agQueue.push({
          used: newSet,
          presses: top.presses + 1,
          lights: newLights.join(""),
        });
      }
    }

    console.log(buttons.length - joltage.length);
    let model = {
      optimize: "presses",
      opType: "min",
      constraints: {},
      variables: {},
      ints: {},
    };
    for (let i = 0; i < joltage.length; i++) {
      model.constraints["j" + i.toString()] = { equal: joltage[i] };
    }
    for (let bt = 0; bt < buttons.length; bt++) {
      model.ints["b" + bt.toString()] = 1;
      const v = {};
      v["presses"] = 1;
      for (const bi of buttons[bt]) {
        v["j" + bi.toString()] = 1;
      }
      model.variables["b" + bt.toString()] = v;
    }

    gold += solver.Solve(model).result;
  }
  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day10.set("main", Main);

export default day10;
