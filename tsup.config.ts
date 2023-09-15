import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['src/entry.server.tsx'],
  outDir: 'build',
  clean: true,
  loader: {
    '.html': 'copy',
    '.ejs': 'copy',
  },
  publicDir: 'src/assets'
})