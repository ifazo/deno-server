import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.ts";

export function productRoutes(req: Request): Promise<Response> | null {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "POST" && path === "/api/products") return addProduct(req);
  if (req.method === "GET" && path === "/api/products") return getProducts();
  if (req.method === "GET" && path.startsWith("/api/products/")) return getProduct(req);
  if (req.method === "PATCH" && path.startsWith("/api/products/")) return updateProduct(req);
  if (req.method === "DELETE" && path.startsWith("/api/products/")) return deleteProduct(req);

  return null;
}
