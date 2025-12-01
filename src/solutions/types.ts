export type SolverFunction = (s: string) => { silver: string; gold: string };

export type SolverCollection = Map<string, SolverFunction>;
