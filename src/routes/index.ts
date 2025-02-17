import { categoryRoutes } from "./category.routes.ts";
import { productRoutes } from "./product.routes.ts";
import { userRoutes } from "./user.routes.ts";

export function mainRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "GET" && path === "/") {
    return Promise.resolve(new Response("Welcome to Deno Server!"));
  } 
  if (req.method === "GET" && path === "/api") {
    return Promise.resolve(new Response("Server API is running successfully!"));
  }

  return userRoutes(req) || categoryRoutes(req) || productRoutes(req) || Promise.resolve(new Response("Not Found", { status: 404 }));
}
