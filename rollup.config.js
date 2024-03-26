import typescript from "@rollup/plugin-typescript";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [dts()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
      },
      {
        file: "dist/index.esm.js",
        format: "es",
      },
    ],
    plugins: [typescript(), autoExternal()],
  },
];
