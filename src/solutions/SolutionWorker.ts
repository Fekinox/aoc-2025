import Solutions from "./Solutions";
import type { JobSpec } from "./types";

self.onmessage = (e: MessageEvent<JobSpec>) => {
  const solver = Solutions.get(e.data.day, e.data.variant);

  self.postMessage(solver(e.data.data));
};

export {};
