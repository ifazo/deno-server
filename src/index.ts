import { mainRouter } from "./routes/index.ts";

const PORT = 8000;

Deno.serve({ port: PORT }, mainRouter);
