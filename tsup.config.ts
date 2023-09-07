import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['server'],
  outDir: 'build',
  clean: true,
  loader: {
    '.html': 'copy',
    '.ejs': 'copy',
  },
})