import { useEffect, useState, useMemo } from "react";
import "./App.css";

import Solutions from "./solutions/Solutions";

import type { SolverOutput } from "./solutions/types";

const solverWorker = new Worker(
  new URL("./solutions/SolutionWorker.ts", import.meta.url),
  { type: "module" },
);

type ProblemState = {
  fileName: string;
  contents: string;
  subState: SolverOutput;
};

function App() {
  const [inputs, setInputs] = useState<ProblemState[]>([]);

  const [solver, setSolver] = useState(8);
  const [variant, setVariant] = useState("main");

  const [workerActive, setWorkerActive] = useState<boolean>(false);

  const collection = Solutions.solvers[solver].collection;

  useEffect(() => {
    // get day of month and set problem to current day if between
    // dec 1 2025 and dec 12 2025
  }, []);

  const runSolver = (data: string): Promise<SolverOutput> => {
    setWorkerActive(true);
    return new Promise((res, rej) => {
      solverWorker.onmessage = (e: MessageEvent<SolverOutput>) => {
        setWorkerActive(false);
        res(e.data);
      };
      solverWorker.onerror = (e) => {
        setWorkerActive(false);
        rej(e);
      };
      solverWorker.onmessageerror = (e) => {
        setWorkerActive(false);
        rej(e);
      };
      solverWorker.postMessage({
        day: solver,
        variant: variant,
        data: data.trim(),
      });
    });
  };

  const runSolverOnInput = async (i: number) => {
    const v = await runSolver(inputs[i].contents);
    setInputs((inputs) =>
      inputs.map((input) => ({
        fileName: input.fileName,
        contents: input.contents,
        subState: v,
      })),
    );
  };

  const readFile = async (f: File): Promise<string> => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (typeof e.target?.result != "string") {
          return;
        }
        res(e.target.result);
      };
      reader.onerror = (e) => {
        rej(e);
      };
      reader.readAsText(f);
    });
  };

  const addFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target?.files) {
      return;
    }
    const file = ev.target.files[0];
    try {
      const contents = await readFile(file);
      const results = await runSolver(contents);
      setInputs((inputs) => {
        return [
          ...inputs,
          {
            fileName: file.name,
            contents: contents,
            subState: results,
          },
        ];
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const replaceFile = async (
    idx: number,
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!ev.target?.files) {
      return;
    }
    const file = ev.target.files[0];
    try {
      const contents = await readFile(file);
      const results = await runSolver(contents);
      const newItem = {
        fileName: file.name,
        contents: contents,
        subState: results,
      };
      setInputs((inputs) => {
        return inputs.map((v, j) => (j == idx ? newItem : v));
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const editFile = async (
    idx: number,
    ev: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (ev.key === "Enter" && ev.getModifierState("Control")) {
      ev.preventDefault();
      const currentItem = inputs[idx];
      const results = await runSolver(currentItem.contents);
      const newItem = {
        fileName: currentItem.fileName,
        contents: currentItem.contents,
        subState: results,
      };

      setInputs(inputs.map((v, j) => (j == idx ? newItem : v)));
    }
  };

  const addTextInput = async (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && ev.getModifierState("Control")) {
      ev.preventDefault();

      try {
        const t = ev.target.value as string;
        const results = await runSolver(t);

        const newItem = {
          fileName: "text",
          contents: t,
          subState: results,
        };
        ev.target.value = "";

        setInputs([...inputs, newItem]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const recompute = async () => {
    for (let i = 0; i < inputs.length; i++) {
      await runSolverOnInput(i);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <select
            value={solver}
            onChange={(ev) => setSolver(Number(ev.target.value))}
          >
            {Solutions.solvers.map((sv, i) => (
              <option key={i} value={i}>
                {sv.name}
              </option>
            ))}
          </select>
          <select
            value={variant}
            onChange={(ev) => setVariant(ev.target.value)}
          >
            {[...collection.keys()].map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </select>
          <button onClick={() => recompute()}>Recompute</button>
          {workerActive ? (
            <button onClick={() => solverWorker.terminate()}>Terminate</button>
          ) : (
            <></>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Input File</th>
              <th>Text Body</th>
              <th>Silver</th>
              <th>Gold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={addFile}
                  ></input>
                  Add File
                </label>
              </td>
              <td>
                <textarea
                  rows={10}
                  cols={40}
                  onKeyDown={addTextInput}
                ></textarea>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {inputs.map((input, i) => (
              <tr key={i}>
                <td>
                  <label>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(ev) => replaceFile(i, ev)}
                    ></input>
                    {input.fileName}
                  </label>
                </td>
                <td>
                  <textarea
                    value={input.contents}
                    rows={10}
                    cols={40}
                    onKeyDown={(ev) => editFile(i, ev)}
                    onChange={function (ev) {
                      const newItem = {
                        fileName: input.fileName,
                        contents: ev.target.value,
                        subState: input.subState,
                      };

                      setInputs(
                        inputs.map((v, idx) => (idx == i ? newItem : v)),
                      );
                    }}
                  ></textarea>
                </td>
                <td>{input.subState.silver}</td>
                <td>{input.subState.gold}</td>
                <td>
                  <button
                    onClick={function () {
                      setInputs(inputs.filter((_, idx) => idx != i));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
