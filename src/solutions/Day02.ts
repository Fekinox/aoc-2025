import type { SolverCollection } from "./types";

const day02: SolverCollection = new Map();

function rep(n: number, k: number) {
  return Number(n.toString().repeat(k));
}

function Main(text: string) {
  const idRanges = text.split(",");
  let silver = 0;
  let gold = 0;

  for (const idRange of idRanges) {
    const [left, right] = idRange.split("-");

    const usedIds = new Set();

    for (let reps = 2; reps <= right.length; reps++) {
      let n = 1;
      let repped = Number(n.toString().repeat(reps));
      while (repped <= Number(right)) {
        if (!usedIds.has(repped) && repped >= Number(left)) {
          usedIds.add(repped);
          console.log(repped);
          if (reps === 2) {
            silver += repped;
          }
          gold += repped;
        }
        n++;
        repped = Number(n.toString().repeat(reps));
      }
    }
  }

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

function ExpoSearch(text: string) {
  const idRanges = text.split(",");
  let silver = 0;
  let gold = 0;

  for (const idRange of idRanges) {
    const [left, right] = idRange.split("-");

    const usedIds = new Set();

    for (let reps = 2; reps <= right.length; reps++) {
      let hi = 1;
      while (rep(hi, reps) <= Number(right)) {
        hi *= 2;
      }

      let lLo = 1;
      let lHi = hi + 1;
      let rLo = 1;
      let rHi = hi + 1;

      while (lLo < lHi) {
        const m = lLo + Math.floor((lHi - lLo) / 2);
        if (rep(m, reps) < Number(left)) {
          lLo = m + 1;
        } else {
          lHi = m;
        }
      }

      // while (rLo < rHi) {
      //   const m = rLo + Math.floor((rHi - rLo) / 2);
      //   if (rep(m, reps) > Number(right)) {
      //     rHi = m;
      //   } else {
      //     rLo = m + 1;
      //   }
      // }
      console.log(rep(lLo, reps));
      // console.log(rep(rHi - 1, reps));
    }
  }

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day02.set("main", Main);
day02.set("exposearch", ExpoSearch);

export default day02;
