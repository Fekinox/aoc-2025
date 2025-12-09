import type { SolverCollection } from "./types";
import { Grid } from "../util/Grid";

const day06: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  const lines = text.split("\n").map((s) =>
    s
      .trim()
      .split(/\s+/)
      .map((n) => {
        if (n !== "*" && n !== "+") {
          return Number(n);
        }
        return n;
      }),
  );
  const h = lines.length;
  const w = lines[0].length;
  for (let c = 0; c < w; c++) {
    if (lines[h - 1][c] === "+") {
      let s = 0;
      for (let r = 0; r < h - 1; r++) {
        s += lines[r][c]!;
      }
      silver += s;
    } else {
      let p = 1;
      for (let r = 0; r < h - 1; r++) {
        p *= lines[r][c]!;
      }
      silver += p;
    }
  }

  const textLines = text.split("\n");
  while (textLines[textLines.length - 1].length !== textLines[0].length) {
    textLines[textLines.length - 1] += " ";
  }

  const height = textLines.length;
  const width = textLines[0].length;
  let numbers: number[] = [];
  let gold = 0;
  for (let xPointer = width - 1; xPointer >= 0; xPointer--) {
    let n = 0;
    let moreNumbers = true;
    for (let yPointer = 0; yPointer < height; yPointer++) {
      if (textLines[yPointer][xPointer] === " ") {
        continue;
      } else if (textLines[yPointer][xPointer] === "+") {
        console.log("+", n, ...numbers);
        let sum = n;
        for (const nb of numbers) {
          sum += nb;
        }
        gold += sum;
        moreNumbers = false;
      } else if (textLines[yPointer][xPointer] === "*") {
        console.log("*", n, ...numbers);
        let prod = n;
        for (const nb of numbers) {
          prod *= nb;
        }
        gold += prod;
        moreNumbers = false;
      } else {
        n = 10 * n + Number(textLines[yPointer][xPointer]);
      }
    }
    if (n !== 0 && moreNumbers) {
      numbers.push(n);
    } else {
      numbers = [];
    }
  }

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day06.set("main", Main);

export default day06;
