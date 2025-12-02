import { useState } from "react";
import "./App.css";

import Solutions from "./solutions/Solutions";

type ProblemState = {
  fileName: string;
  contents: string;
  subState: {
    silver: string;
    gold: string;
  };
};

function App() {
  const [inputs, setInputs] = useState<ProblemState[]>([]);

  const [solver, setSolver] = useState(0);
  const [variant, setVariant] = useState("main");

  const collection = Solutions.solvers[solver].collection;

  const runner = collection.get(variant);
  if (runner === undefined) {
    throw new Error("undefined variant");
  }

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
          <button
            onClick={function () {
              setInputs(
                inputs.map((input) => ({
                  fileName: input.fileName,
                  contents: input.contents,
                  subState: runner(input.contents),
                })),
              );
            }}
          >
            Recompute
          </button>
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
                    onChange={function (ev) {
                      if (!ev.target?.files) {
                        return;
                      }
                      const file = ev.target.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        if (typeof e.target?.result != "string") {
                          return;
                        }
                        setInputs(function (inputs) {
                          if (typeof e.target?.result != "string") {
                            return inputs;
                          }
                          if (!ev.target?.files) {
                            return inputs;
                          }

                          const newItem = {
                            fileName: ev.target.files[0].name,
                            contents: e.target.result,
                            subState: runner(e.target.result),
                          };

                          return [...inputs, newItem];
                        });
                      };
                      reader.readAsText(file);
                    }}
                  ></input>
                  Add File
                </label>
              </td>
              <td>
                <textarea
                  rows={10}
                  cols={40}
                  onKeyDown={function (ev) {
                    if (ev.key === "Enter" && ev.getModifierState("Control")) {
                      ev.preventDefault();
                      const newItem = {
                        fileName: "text",
                        contents: ev.currentTarget.value,
                        subState: runner(ev.currentTarget.value),
                      };
                      ev.currentTarget.value = "";

                      setInputs([...inputs, newItem]);
                    }
                  }}
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
                      onChange={function (ev) {
                        if (!ev.target?.files) {
                          return;
                        }
                        const file = ev.target.files[0];
                        const reader = new FileReader();
                        reader.onload = function (e) {
                          if (typeof e.target?.result != "string") {
                            return;
                          }
                          setInputs(function (inputs) {
                            if (typeof e.target?.result != "string") {
                              return inputs;
                            }
                            if (!ev.target?.files) {
                              return inputs;
                            }

                            const newItem = {
                              fileName: ev.target.files[0].name,
                              contents: e.target.result,
                              subState: runner(e.target.result),
                            };

                            return inputs.map((v, idx) =>
                              idx == i ? newItem : v,
                            );
                          });
                        };
                        reader.readAsText(file);
                      }}
                    ></input>
                    {input.fileName}
                  </label>
                </td>
                <td>
                  <textarea
                    value={input.contents}
                    rows={10}
                    cols={40}
                    onKeyDown={function (ev) {
                      if (
                        ev.key === "Enter" &&
                        ev.getModifierState("Control")
                      ) {
                        ev.preventDefault();
                        const newItem = {
                          fileName: input.fileName,
                          contents: input.contents,
                          subState: runner(input.contents),
                        };

                        setInputs(
                          inputs.map((v, idx) => (idx == i ? newItem : v)),
                        );
                      }
                    }}
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
