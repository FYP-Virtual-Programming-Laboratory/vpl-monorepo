import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json", rollupTypes: true }),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CodeCollab",
      fileName: "code-collab",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@apollo/client"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJsxRuntime",
          "@apollo/client": "ApolloClient",
        },
      },
    },
  },
});
