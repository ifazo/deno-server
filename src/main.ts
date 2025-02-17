import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./controllers/productController.ts";

const PORT = 3000;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  // Home route
  if (req.method === "GET" && path === "/") {
    return new Response("Welcome to Deno Server!");
  } 
  // API route
  else if (req.method === "GET" && path === "/api") {
    return new Response("Server API is running successfully!");
  }
  // Create a new product
  else if (req.method === "POST" && path === "/api/products") {
    return await addProduct(req);
  }
  // Get all products
   else if (req.method === "GET" && path === "/api/products") {
    return await getProducts();
  }
  // Get a single product
   else if (req.method === "GET" && path.startsWith("/api/products/")) {
    return await getProduct(req);
  } 
  // Update a product
  else if (req.method === "PATCH" && path.startsWith("/api/products/")) {
    return await updateProduct(req);
  }
  // Delete a product
   else if (req.method === "DELETE" && path.startsWith("/api/products/")) {
    return await deleteProduct(req);
  }
  // Not found
  return new Response("Not Found", { status: 404 });
}

console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);
Deno.serve({ port: PORT }, handler);
