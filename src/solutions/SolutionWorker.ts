import Solutions from "./Solutions";
import type { JobSpec } from "./types";

self.onmessage = (e: MessageEvent<JobSpec>) => {
  console.log("huh", e);
  const solver = Solutions.get(e.data.day, e.data.variant);

  self.postMessage(solver(e.data.data));
};

export {};
