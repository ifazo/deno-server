import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/category.controller.ts";

export function categoryRoutes(req: Request): Promise<Response> | null {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "POST" && path === "/api/categories") return addCategory(req);
  if (req.method === "GET" && path === "/api/categories") return getCategories();
  if (req.method === "GET" && path.startsWith("/api/categories/")) return getCategory(req);
  if (req.method === "PATCH" && path.startsWith("/api/categories/")) return updateCategory(req);
  if (req.method === "DELETE" && path.startsWith("/api/categories/")) return deleteCategory(req);

  return null;
}
