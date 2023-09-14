import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['src/server.tsx'],
  outDir: 'build',
  clean: true,
  loader: {
    '.html': 'copy',
    '.ejs': 'copy',
  },
  publicDir: 'src/assets'
})