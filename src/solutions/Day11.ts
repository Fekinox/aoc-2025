import type { SolverCollection } from "./types";

const day11: SolverCollection = new Map();

function Main(text: string) {
  const lines = text.split("\n");
  const gph = new Map<string, string[]>();
  for (const line of text.split("\n")) {
    const [head, rest] = line.split(": ");
    gph.set(head, rest.split(" "));
  }

  const pathsToMap = function (destination: string) {
    const pathMap = new Map<string, number>();
    pathMap.set(destination, 1);
    while (true) {
      let relaxations = 0;
      for (const [src, dsts] of gph.entries()) {
        let sum = 0;
        if (src === destination) {
          continue;
        }
        for (const dst of dsts) {
          if (pathMap.has(dst)) {
            sum += pathMap.get(dst);
          }
        }
        if (!pathMap.has(src) || pathMap.get(src) !== sum) {
          relaxations++;
        }
        pathMap.set(src, sum);
      }
      if (relaxations === 0) {
        break;
      }
    }
    return pathMap;
  };

  const toOutMap = pathsToMap("out");
  const toDacMap = pathsToMap("dac");
  const toFftMap = pathsToMap("fft");

  let gold = toDacMap.get("svr")! * toFftMap.get("dac")! * toOutMap.get("fft")!;
  gold += toFftMap.get("svr")! * toDacMap.get("fft")! * toOutMap.get("dac")!;

  return {
    silver: toOutMap.get("you")?.toString(),
    gold: gold,
  };
}

day11.set("main", Main);

export default day11;
