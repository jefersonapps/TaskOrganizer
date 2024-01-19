export const mmlOptions = {
  messageStyle: "none",
  extensions: ["tex2jax.js"],
  jax: ["input/TeX", "output/HTML-CSS"],
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  TeX: {
    extensions: [
      "AMSmath.js",
      "AMSsymbols.js",
      "noErrors.js",
      "noUndefined.js",
    ],
  },
  showMathMenu: false,
};

export const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

type PriorityLevels = {
  [key: string]: number;
  alta: number;
  media: number;
  baixa: number;
};
export const priorityLevels: PriorityLevels = {
  alta: 3,
  media: 2,
  baixa: 1,
};

export const priorityColors = {
  alta: "#dc2626",
  media: "#ea580c",
  baixa: "#06b6d4",
};
