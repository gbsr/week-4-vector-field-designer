import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  base: "/week-4-vector-field-designer/",
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        test: resolve(__dirname, "test.html"),
      },
    },
  },
})
