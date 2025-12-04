export type SolverOutput = { silver: string; gold: string };

export type SolverFunction = (s: string) => SolverOutput;

export type SolverCollection = Map<string, SolverFunction>;

export type JobSpec = {
  day: number;
  variant: string;
  data: string;
};
