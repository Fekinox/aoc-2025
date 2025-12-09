import { Heap } from "../util/Heap";
import type { SolverCollection } from "./types";

const day08: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;

  const juncts = text.split("\n").map((l) => l.split(",").map(Number));
  const heap: Heap<number, string> = Heap.makeMinHeap();

  const circuits = Array.from(juncts, (_, i) => i);

  const dist = (a, b) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
  };

  for (let i = 0; i < juncts.length; i++) {
    for (let j = i + 1; j < juncts.length; j++) {
      heap.push(dist(juncts[i], juncts[j]), `${i}:${j}`);
    }
  }

  for (let c = 0; c < 1000; c++) {
    const it = heap.pop();

    if (it === null) {
      throw new Error("oops");
    }

    const [i, j]: number[] = it.value.split(":").map(Number);
    console.log(juncts[i], juncts[j]);
    const setA = circuits[i];
    const setB = circuits[j];
    if (setA === setB) {
      continue;
    }

    for (let k = 0; k < circuits.length; k++) {
      if (circuits[k] === setB) {
        circuits[k] = setA;
      }
    }
  }

  const freqs = new Map();
  for (let i = 0; i < circuits.length; i++) {
    const cr = circuits[i];
    if (freqs.has(cr)) {
      freqs.set(cr, freqs.get(cr) + 1);
    } else {
      freqs.set(cr, 1);
    }
  }

  const ranks = [...freqs.values()];
  ranks.sort((a, b) => a - b);
  ranks.reverse();
  silver = ranks[0] * ranks[1] * ranks[2];

  const done = function () {
    const c = circuits[0];
    for (let i = 1; i < circuits.length; i++) {
      if (c !== circuits[i]) {
        return false;
      }
    }
    return true;
  };

  let lastAX = 0;
  let lastBX = 0;
  while (!done()) {
    const it = heap.pop();

    if (it === null) {
      throw new Error("oops");
    }

    const [i, j]: number[] = it.value.split(":").map(Number);
    lastAX = juncts[i][0];
    lastBX = juncts[j][0];
    const setA = circuits[i];
    const setB = circuits[j];
    if (setA === setB) {
      continue;
    }

    for (let k = 0; k < circuits.length; k++) {
      if (circuits[k] === setB) {
        circuits[k] = setA;
      }
    }
  }

  gold = lastAX * lastBX;

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day08.set("main", Main);

export default day08;
