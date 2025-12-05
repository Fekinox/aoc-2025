import type { SolverCollection } from "./types";

const day05: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;
  const lines = text.split("\n");
  const gap = lines.indexOf("");

  let ranges = lines.slice(0, gap).map((l) => l.split("-").map(Number));
  ranges.sort((a, b) => a[0] - b[0]);
  console.log(ranges);
  for (const ing of lines.slice(gap + 1)) {
    for (const range of ranges) {
      if (Number(ing) >= range[0] && Number(ing) <= range[1]) {
        silver++;
        break;
      }
    }
  }

  outer: while (true) {
    console.log("pass");
    for (let i = 0; i < ranges.length; i++) {
      let mn = ranges[i][0];
      let mx = ranges[i][1];
      // get all ranges overlapping this
      for (let j = i + 1; j < ranges.length; j++) {
        if (
          j !== i &&
          ((ranges[i][0] <= ranges[j][0] && ranges[j][0] <= ranges[i][1]) ||
            (ranges[i][0] <= ranges[j][1] && ranges[j][1] <= ranges[i][1]))
        ) {
          mn = Math.min(ranges[i][0], ranges[j][0]);
          mx = Math.max(ranges[i][1], ranges[j][1]);

          ranges.splice(j, 1);
          ranges.splice(i, 1, [mn, mx]);

          continue outer;
        }
      }
    }
    break;
  }

  for (const rnge of ranges) {
    gold += rnge[1] - rnge[0] + 1;
  }

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day05.set("main", Main);

export default day05;
