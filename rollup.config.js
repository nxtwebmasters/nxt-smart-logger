import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/ConsoleInterceptor.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm", // ES Module format
      sourcemap: true,
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs", // CommonJS format
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
  ],
  external: ["@angular/core"], // Mark peer dependencies as external
};
