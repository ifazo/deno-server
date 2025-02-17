import { mainRouter } from "./routes/index.ts";

const PORT = 3000;

console.log(`Deno server running at http://localhost:${PORT}`);

Deno.serve({ port: PORT }, mainRouter);
