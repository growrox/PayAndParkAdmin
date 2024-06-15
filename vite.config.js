import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

console.log("Load env ", loadEnv("dev", "./"));
// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  console.log("mode ", mode);
  console.log("CWD ",process.cwd());
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
        react(),
      ],
    // To access env vars here use process.env.TEST_VAR
  });
}
// export default defineConfig({
//   plugins: [
//     react(),
//   ],
//   envDir: "./env"

// })
