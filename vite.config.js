import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path'

console.log("Load env ", loadEnv("dev", "./"));
// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  console.log("mode ", mode);
  console.log("CWD ", process.cwd());
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          nested: resolve(__dirname, "nested/index.html"),
        },
      },
    },
  });
};
// export default defineConfig({
//   plugins: [
//     react(),
//   ],
//   envDir: "./env"

// })
