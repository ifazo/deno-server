import { addUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.ts";

export function userRoutes(req: Request): Promise<Response> | null {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "POST" && path === "/api/users") return addUser(req);
  if (req.method === "GET" && path === "/api/users") return getUsers();
  if (req.method === "GET" && path.startsWith("/api/users/")) return getUser(req);
  if (req.method === "PATCH" && path.startsWith("/api/users/")) return updateUser(req);
  if (req.method === "DELETE" && path.startsWith("/api/users/")) return deleteUser(req);

  return null;
}