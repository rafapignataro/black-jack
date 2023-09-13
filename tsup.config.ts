import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['server', 'app'],
  outDir: 'build',
  clean: true,
  loader: {
    '.html': 'copy',
    '.ejs': 'copy',
  },
})