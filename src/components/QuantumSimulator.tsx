import { useCallback, useMemo, useState } from "react";
import {
  GATE_HINTS,
  GATE_LABELS,
  MAX_COLUMNS,
  PRESETS,
  type GateType,
  type PlacedGate,
  basisLabels,
  formatAmplitude,
  prob,
  qubitVisualization,
  runCircuit,
} from "../quantum/simulator";

const PALETTE: GateType[] = ["H", "X", "Y", "Z", "S", "T", "CNOT", "SWAP", "BAR"];
type Tool = GateType | "ERASE";

let gateId = 0;
const nextId = () => `g${++gateId}`;

export function QuantumSimulator() {
  const [gates, setGates] = useState<PlacedGate[]>([]);
  const [history, setHistory] = useState<PlacedGate[][]>([]);
  const [selected, setSelected] = useState<Tool>("H");
  const [cnotStep, setCnotStep] = useState<0 | 1>(0);
  const [cnotControl, setCnotControl] = useState<0 | 1 | null>(null);
  const [stepIndex, setStepIndex] = useState<number | null>(null);

  const commitGates = useCallback((next: PlacedGate[] | ((prev: PlacedGate[]) => PlacedGate[])) => {
    setGates((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      setHistory((h) => [...h.slice(-24), prev]);
      return resolved;
    });
  }, []);

  const activeGates = useMemo(() => {
    if (stepIndex === null) return gates;
    const sorted = [...gates]
      .filter((g) => g.type !== "BAR")
      .sort((a, b) => a.column - b.column);
    return sorted.slice(0, stepIndex + 1);
  }, [gates, stepIndex]);

  const state = useMemo(() => runCircuit(activeGates), [activeGates]);
  const labels = basisLabels(2);
  const probabilities = state.map(prob);
  const q0View = useMemo(() => qubitVisualization(state, 0), [state]);
  const q1View = useMemo(() => qubitVisualization(state, 1), [state]);

  const cnotInColumn = (column: number) => {
    const gate = gates.find((g) => g.column === column && g.type === "CNOT");
    return gate?.type === "CNOT" ? gate : undefined;
  };

  const eraseAt = useCallback(
    (column: number, qubit: 0 | 1) => {
      commitGates((prev) =>
        prev.filter((g) => {
          if (g.column !== column) return true;
          if (g.type === "SWAP" || g.type === "BAR" || g.type === "CNOT") return false;
          return !("qubit" in g) || g.qubit !== qubit;
        }),
      );
      setStepIndex(null);
    },
    [commitGates],
  );

  const placeGate = useCallback(
    (column: number, qubit: 0 | 1) => {
      if (selected === "ERASE") {
        eraseAt(column, qubit);
        return;
      }

      if (selected === "CNOT") {
        if (cnotStep === 0) {
          setCnotControl(qubit);
          setCnotStep(1);
          return;
        }
        if (cnotControl === null) return;
        const target = qubit;
        const control = cnotControl;
        if (control === target) {
          setCnotStep(0);
          setCnotControl(null);
          return;
        }
        commitGates((prev) => [
          ...prev.filter((g) => g.column !== column || g.type !== "CNOT"),
          { id: nextId(), type: "CNOT", control, target, column },
        ]);
        setCnotStep(0);
        setCnotControl(null);
        setStepIndex(null);
        return;
      }

      if (selected === "SWAP") {
        commitGates((prev) => [
          ...prev.filter((g) => g.column !== column || g.type !== "SWAP"),
          { id: nextId(), type: "SWAP", column },
        ]);
        setStepIndex(null);
        return;
      }

      if (selected === "BAR") {
        commitGates((prev) => [
          ...prev.filter((g) => g.column !== column || g.type !== "BAR"),
          { id: nextId(), type: "BAR", column },
        ]);
        return;
      }

      commitGates((prev) => [
        ...prev.filter(
          (g) => g.column !== column || !("qubit" in g) || g.qubit !== qubit,
        ),
        { id: nextId(), type: selected, qubit, column },
      ]);
      setStepIndex(null);
    },
    [selected, cnotStep, cnotControl, commitGates, eraseAt],
  );

  const gateAt = (column: number, qubit: 0 | 1): string | null => {
    for (const g of gates) {
      if (g.column !== column) continue;
      if (g.type === "BAR") return "|";
      if (g.type === "SWAP") return "SW";
      if (g.type === "CNOT") {
        if (g.control === qubit) return "*";
        if (g.target === qubit) return "+";
      }
      if ("qubit" in g && g.qubit === qubit) return GATE_LABELS[g.type];
    }
    return null;
  };

  const reset = () => {
    commitGates([]);
    setStepIndex(null);
    setCnotStep(0);
    setCnotControl(null);
  };

  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setGates(prev);
    setStepIndex(null);
    setCnotStep(0);
    setCnotControl(null);
  };

  const loadPreset = (preset: (typeof PRESETS)[number]) => {
    commitGates(preset.gates.map((g) => ({ ...g, id: nextId() })));
    setStepIndex(null);
  };

  const sorted = [...gates]
    .filter((g) => g.type !== "BAR")
    .sort((a, b) => a.column - b.column);

  const stepForward = () => {
    if (sorted.length === 0) return;
    setStepIndex((i) => (i === null ? 0 : Math.min(i + 1, sorted.length - 1)));
  };

  const stepBack = () => {
    setStepIndex((i) => {
      if (i === null) return sorted.length - 1;
      if (i <= 0) return null;
      return i - 1;
    });
  };

  return (
    <div className="qsim">
      <div className="qsim-titlebar">
        <span className="qsim-titlebar-text">2-Qubit Quantum Circuit Simulator</span>
      </div>

      <div className="qsim-body">
        <p className="qsim-intro">
          Welcome. Pick a gate below, then click a cell in the circuit table.
          <br />
          <b>CX:</b> click control qubit, then target. <b>ERASE:</b> remove gates in a cell.
        </p>

        <fieldset className="qsim-fieldset">
          <legend>Gate Palette</legend>
          <table className="qsim-btn-table" cellPadding={2} cellSpacing={2}>
            <tbody>
              <tr>
                {PALETTE.map((g) => (
                  <td key={g}>
                    <button
                      type="button"
                      className={`qsim-winbtn${selected === g ? " qsim-winbtn-active" : ""}`}
                      title={GATE_HINTS[g]}
                      onClick={() => {
                        setSelected(g);
                        setCnotStep(0);
                        setCnotControl(null);
                      }}
                    >
                      {GATE_LABELS[g]}
                    </button>
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className={`qsim-winbtn qsim-winbtn-erase${selected === "ERASE" ? " qsim-winbtn-active" : ""}`}
                    title="Remove gate at clicked cell"
                    onClick={() => {
                      setSelected("ERASE");
                      setCnotStep(0);
                      setCnotControl(null);
                    }}
                  >
                    ERASE
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {selected === "CNOT" && (
            <p className="qsim-hint">
              <b>NOTE:</b>{" "}
              {cnotStep === 0
                ? "Step 1 — click the control wire (marked *)."
                : "Step 2 — click the target wire (marked +)."}
            </p>
          )}
        </fieldset>

        <fieldset className="qsim-fieldset">
          <legend>Circuit Editor</legend>
          <table className="qsim-circuit-table" cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td className="qsim-corner" />
                {Array.from({ length: MAX_COLUMNS }, (_, col) => (
                  <td key={col} className="qsim-col-head">
                    t{col + 1}
                  </td>
                ))}
              </tr>
              {[0, 1].map((q) => {
                const qubit = q as 0 | 1;
                return (
                  <tr key={q}>
                    <th className="qsim-wire-head" scope="row">
                      q{qubit}
                    </th>
                    {Array.from({ length: MAX_COLUMNS }, (_, col) => {
                      const label = gateAt(col, qubit);
                      const cnot = cnotInColumn(col);
                      let stemDown = false;
                      let stemUp = false;
                      if (cnot) {
                        if (cnot.control === qubit && cnot.control < cnot.target) stemDown = true;
                        if (cnot.target === qubit && cnot.control < cnot.target) stemUp = true;
                        if (cnot.control === qubit && cnot.control > cnot.target) stemUp = true;
                        if (cnot.target === qubit && cnot.control > cnot.target) stemDown = true;
                      }

                      return (
                        <td key={col} className="qsim-cell-wrap">
                          <button
                            type="button"
                            className={`qsim-cell${label ? " qsim-cell-filled" : ""}`}
                            onClick={() => placeGate(col, qubit)}
                            aria-label={`Time ${col + 1}, qubit ${qubit}`}
                          >
                            {stemDown && (
                              <span className="qsim-cnot-stem qsim-cnot-stem-down" aria-hidden />
                            )}
                            {stemUp && (
                              <span className="qsim-cnot-stem qsim-cnot-stem-up" aria-hidden />
                            )}
                            {label && <span className="qsim-glyph">{label}</span>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </fieldset>

        <fieldset className="qsim-fieldset">
          <legend>Controls</legend>
          <table className="qsim-btn-table" cellPadding={2} cellSpacing={2}>
            <tbody>
              <tr>
                <td>
                  <button type="button" className="qsim-winbtn" onClick={reset}>
                    Reset |00&gt;
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="qsim-winbtn"
                    onClick={undo}
                    disabled={history.length === 0}
                  >
                    Undo
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="qsim-winbtn"
                    onClick={stepBack}
                    disabled={sorted.length === 0}
                  >
                    &lt;&lt; Step
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="qsim-winbtn"
                    onClick={stepForward}
                    disabled={sorted.length === 0}
                  >
                    Step &gt;&gt;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="qsim-hint qsim-hint-muted">Presets:</p>
          <table className="qsim-btn-table" cellPadding={2} cellSpacing={2}>
            <tbody>
              <tr>
                {PRESETS.map((p) => (
                  <td key={p.name}>
                    <button
                      type="button"
                      className="qsim-winbtn qsim-winbtn-preset"
                      onClick={() => loadPreset(p)}
                    >
                      {p.name}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </fieldset>

        <fieldset className="qsim-fieldset">
          <legend>Measurement Probabilities</legend>
          <table className="qsim-prob-table" cellPadding={2} cellSpacing={0} width="100%">
            <tbody>
              {labels.map((label, i) => {
                const pct = Math.min(100, probabilities[i] * 100);
                return (
                  <tr key={label}>
                    <td className="qsim-ket">{label}</td>
                    <td className="qsim-bar-cell">
                      <table className="qsim-bar-inner" cellPadding={0} cellSpacing={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="qsim-bar-fill" style={{ width: `${pct}%` }}>
                              &nbsp;
                            </td>
                            <td className="qsim-bar-empty">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="qsim-bar-val">{pct.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </fieldset>

        <fieldset className="qsim-fieldset">
          <legend>State Vector |psi&gt;</legend>
          <pre className="qsim-state-pre">
            {labels.map((label, i) => (
              <span key={label}>
                {formatAmplitude(state[i])} {label}
                {"\n"}
              </span>
            ))}
          </pre>
        </fieldset>

        <fieldset className="qsim-fieldset">
          <legend>Qubit Visualization</legend>
          <table className="qsim-qubit-table" cellPadding={4} cellSpacing={0} width="100%">
            <tbody>
              {([
                ["q0", q0View],
                ["q1", q1View],
              ] as const).map(([name, view]) => {
                const p0pct = view.p0 * 100;
                const p1pct = view.p1 * 100;
                const dotX = 50 + view.bloch.x * 38;
                const dotY = 50 - view.bloch.y * 38;

                return (
                  <tr key={name}>
                    <td className="qsim-qubit-label">{name}</td>
                    <td className="qsim-qubit-bloch-cell">
                      <div className="qsim-bloch" aria-label={`${name} Bloch sphere projection`}>
                        <span className="qsim-bloch-axis qsim-bloch-axis-x" aria-hidden />
                        <span className="qsim-bloch-axis qsim-bloch-axis-y" aria-hidden />
                        <span
                          className="qsim-bloch-dot"
                          style={{ left: `${dotX}%`, top: `${dotY}%` }}
                          title={`x=${view.bloch.x.toFixed(2)}, y=${view.bloch.y.toFixed(2)}, z=${view.bloch.z.toFixed(2)}`}
                        />
                      </div>
                      <div className="qsim-bloch-z">
                        z = {view.bloch.z >= 0 ? "+" : ""}
                        {view.bloch.z.toFixed(2)}
                      </div>
                    </td>
                    <td className="qsim-qubit-bar-cell">
                      <div className="qsim-qubit-wire">
                        <span>|0&gt;</span>
                        <span className="qsim-qubit-wire-line" aria-hidden />
                        <span>|1&gt;</span>
                      </div>
                      <table className="qsim-qubit-split" cellPadding={0} cellSpacing={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="qsim-qubit-zero" style={{ width: `${p0pct}%` }}>
                              &nbsp;
                            </td>
                            <td className="qsim-qubit-one" style={{ width: `${p1pct}%` }}>
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="qsim-qubit-pct">
                        |0&gt; {p0pct.toFixed(1)}% &nbsp; |1&gt; {p1pct.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </fieldset>

        <hr className="qsim-hr" />

        <p className="qsim-status">
          <b>Status:</b>{" "}
          {stepIndex === null
            ? `${sorted.length} gate${sorted.length === 1 ? "" : "s"} in circuit.`
            : `Showing step ${stepIndex + 1} of ${sorted.length}.`}
          {" "}
          <i>Last updated: {new Date().toLocaleDateString()}</i>
        </p>
      </div>
    </div>
  );
}
