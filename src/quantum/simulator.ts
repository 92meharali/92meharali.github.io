export type Complex = { re: number; im: number };

export const c = (re: number, im = 0): Complex => ({ re, im });

export const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const scale = (a: Complex, s: number): Complex => ({
  re: a.re * s,
  im: a.im * s,
});

export const prob = (a: Complex) => a.re * a.re + a.im * a.im;

const SQRT2 = Math.SQRT1_2;

export type GateType = "H" | "X" | "Y" | "Z" | "S" | "T" | "CNOT" | "SWAP" | "BAR";

export type PlacedGate =
  | { id: string; type: "H" | "X" | "Y" | "Z" | "S" | "T"; qubit: 0 | 1; column: number }
  | { id: string; type: "CNOT"; control: 0 | 1; target: 0 | 1; column: number }
  | { id: string; type: "SWAP"; column: number }
  | { id: string; type: "BAR"; column: number };

export const GATE_LABELS: Record<GateType, string> = {
  H: "H",
  X: "X",
  Y: "Y",
  Z: "Z",
  S: "S",
  T: "T",
  CNOT: "CX",
  SWAP: "SW",
  BAR: "|",
};

export const GATE_HINTS: Record<GateType, string> = {
  H: "Hadamard — superposition",
  X: "Pauli-X — bit flip",
  Y: "Pauli-Y",
  Z: "Pauli-Z — phase flip",
  S: "Phase gate",
  T: "pi/8 phase",
  CNOT: "Controlled-NOT",
  SWAP: "Swap qubits",
  BAR: "Barrier (visual)",
};

const singleMatrices: Record<"H" | "X" | "Y" | "Z" | "S" | "T", Complex[][]> = {
  H: [
    [c(SQRT2), c(SQRT2)],
    [c(SQRT2), c(-SQRT2)],
  ],
  X: [
    [c(0), c(1)],
    [c(1), c(0)],
  ],
  Y: [
    [c(0), c(0, -1)],
    [c(0, 1), c(0)],
  ],
  Z: [
    [c(1), c(0)],
    [c(0), c(-1)],
  ],
  S: [
    [c(1), c(0)],
    [c(0), c(0, 1)],
  ],
  T: [
    [c(1), c(0)],
    [c(0), c(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))],
  ],
};

function kron(a: Complex[][], b: Complex[][]): Complex[][] {
  const rows = a.length * b.length;
  const out: Complex[][] = Array.from({ length: rows }, () =>
    Array.from({ length: rows }, () => c(0)),
  );
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      for (let k = 0; k < b.length; k++) {
        for (let l = 0; l < b.length; l++) {
          const row = i * b.length + k;
          const col = j * b.length + l;
          out[row][col] = mul(a[i][j], b[k][l]);
        }
      }
    }
  }
  return out;
}

const I2: Complex[][] = [
  [c(1), c(0)],
  [c(0), c(1)],
];

function singleOnQubit(gate: Complex[][], qubit: 0 | 1): Complex[][] {
  return qubit === 0 ? kron(gate, I2) : kron(I2, gate);
}

function buildCNOT(control: 0 | 1, target: 0 | 1): Complex[][] {
  const dim = 4;
  const m: Complex[][] = Array.from({ length: dim }, (_, i) =>
    Array.from({ length: dim }, (_, j) => (i === j ? c(1) : c(0))),
  );
  for (let i = 0; i < dim; i++) {
    const bits = [(i >> 1) & 1, i & 1] as [number, number];
    if (bits[control] === 1) {
      const jBits: [number, number] = [...bits];
      jBits[target] ^= 1;
      const j = (jBits[0] << 1) | jBits[1];
      m[i][i] = c(0);
      m[i][j] = c(1);
    }
  }
  return m;
}

const SWAP_MATRIX: Complex[][] = [
  [c(1), c(0), c(0), c(0)],
  [c(0), c(0), c(1), c(0)],
  [c(0), c(1), c(0), c(0)],
  [c(0), c(0), c(0), c(1)],
];

function matVec(m: Complex[][], v: Complex[]): Complex[] {
  return m.map((row) =>
    row.reduce((sum, cell, j) => add(sum, mul(cell, v[j])), c(0)),
  );
}

export function initialState(): Complex[] {
  return [c(1), c(0), c(0), c(0)];
}

export function normalize(state: Complex[]): Complex[] {
  const norm = Math.sqrt(state.reduce((s, a) => s + prob(a), 0));
  if (norm < 1e-10) return initialState();
  return state.map((a) => scale(a, 1 / norm));
}

export function applyGate(state: Complex[], gate: PlacedGate): Complex[] {
  if (gate.type === "BAR") return state;

  let matrix: Complex[][];
  switch (gate.type) {
    case "H":
    case "X":
    case "Y":
    case "Z":
    case "S":
    case "T":
      matrix = singleOnQubit(singleMatrices[gate.type], gate.qubit);
      break;
    case "CNOT":
      matrix = buildCNOT(gate.control, gate.target);
      break;
    case "SWAP":
      matrix = SWAP_MATRIX;
      break;
    default:
      return state;
  }
  return normalize(matVec(matrix, state));
}

export function runCircuit(gates: PlacedGate[]): Complex[] {
  const sorted = [...gates]
    .filter((g) => g.type !== "BAR")
    .sort((a, b) => a.column - b.column);
  return sorted.reduce((s, g) => applyGate(s, g), initialState());
}

export function basisLabels(numQubits = 2): string[] {
  const n = 2 ** numQubits;
  return Array.from({ length: n }, (_, i) => {
    const bits = i.toString(2).padStart(numQubits, "0");
    return `|${bits}>`;
  });
}

export function formatAmplitude(z: Complex): string {
  const re = Math.abs(z.re) < 1e-4 ? 0 : z.re;
  const im = Math.abs(z.im) < 1e-4 ? 0 : z.im;
  if (im === 0) return re.toFixed(3);
  const sign = im >= 0 ? "+" : "-";
  return `${re.toFixed(3)} ${sign} ${Math.abs(im).toFixed(3)}i`;
}

export const conj = (z: Complex): Complex => ({ re: z.re, im: -z.im });

export type QubitView = {
  p0: number;
  p1: number;
  bloch: { x: number; y: number; z: number };
};

function marginalProb(state: Complex[], qubit: 0 | 1): { p0: number; p1: number } {
  let p0 = 0;
  let p1 = 0;
  for (let i = 0; i < state.length; i++) {
    const bit = qubit === 0 ? (i >> 1) & 1 : i & 1;
    const p = prob(state[i]);
    if (bit === 0) p0 += p;
    else p1 += p;
  }
  return { p0, p1 };
}

function blochFromRho(rho: Complex[][]): { x: number; y: number; z: number } {
  return {
    x: 2 * rho[0][1].re,
    y: 2 * rho[0][1].im,
    z: rho[0][0].re - rho[1][1].re,
  };
}

function reducedRho(state: Complex[], qubit: 0 | 1): Complex[][] {
  if (qubit === 0) {
    return [
      [
        add(mul(conj(state[0]), state[0]), mul(conj(state[1]), state[1])),
        add(mul(conj(state[0]), state[2]), mul(conj(state[1]), state[3])),
      ],
      [
        add(mul(conj(state[2]), state[0]), mul(conj(state[3]), state[1])),
        add(mul(conj(state[2]), state[2]), mul(conj(state[3]), state[3])),
      ],
    ];
  }

  return [
    [
      add(mul(conj(state[0]), state[0]), mul(conj(state[2]), state[2])),
      add(mul(conj(state[0]), state[1]), mul(conj(state[2]), state[3])),
    ],
    [
      add(mul(conj(state[1]), state[0]), mul(conj(state[3]), state[2])),
      add(mul(conj(state[1]), state[1]), mul(conj(state[3]), state[3])),
    ],
  ];
}

export function qubitVisualization(state: Complex[], qubit: 0 | 1): QubitView {
  const { p0, p1 } = marginalProb(state, qubit);
  const bloch = blochFromRho(reducedRho(state, qubit));
  return { p0, p1, bloch };
}

export const PRESETS: { name: string; gates: PlacedGate[] }[] = [
  {
    name: "Bell |Phi+>",
    gates: [
      { id: "p1", type: "H", qubit: 0, column: 0 },
      { id: "p2", type: "CNOT", control: 0, target: 1, column: 1 },
    ],
  },
  {
    name: "Superposition",
    gates: [
      { id: "p3", type: "H", qubit: 0, column: 0 },
      { id: "p4", type: "H", qubit: 1, column: 1 },
    ],
  },
  {
    name: "Phase kick",
    gates: [
      { id: "p5", type: "H", qubit: 0, column: 0 },
      { id: "p6", type: "Z", qubit: 0, column: 1 },
      { id: "p7", type: "H", qubit: 0, column: 2 },
    ],
  },
  {
    name: "SWAP test",
    gates: [
      { id: "p8", type: "X", qubit: 0, column: 0 },
      { id: "p9", type: "SWAP", column: 1 },
    ],
  },
  {
    name: "Entangle + Y",
    gates: [
      { id: "p10", type: "H", qubit: 0, column: 0 },
      { id: "p11", type: "CNOT", control: 0, target: 1, column: 1 },
      { id: "p12", type: "Y", qubit: 1, column: 2 },
    ],
  },
];

export const MAX_COLUMNS = 8;
