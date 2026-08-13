import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace 'REPO_NAME' below with your actual GitHub repo name
// e.g. if your repo is github.com/yourname/memory-game, set base: '/memory-game/'
export default defineConfig({
  plugins: [react()],
  base: "/REPO_NAME/",
});
