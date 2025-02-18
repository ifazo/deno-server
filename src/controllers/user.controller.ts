import { ObjectId } from "mongodb";
import { users, redis } from "../db.ts";

async function addUser(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await users.insertOne(body);
    await redis.del("users");
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUsers(): Promise<Response> {
  try {
    const cachedUsers = await redis.get("users");
    if (cachedUsers) {
      return new Response(cachedUsers, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await users.find().toArray();
    await redis.set("users", JSON.stringify(result));
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUser(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const cachedUser = await redis.get(`user:${id}`);
    if (cachedUser) {
      return new Response(cachedUser, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await users.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.set(`user:${id}`, JSON.stringify(result));
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function updateUser(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`user:${id}`);
    await redis.del("users");
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function deleteUser(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const result = await users.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`user:${id}`);
    await redis.del("users");
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export { addUser, getUsers, getUser, updateUser, deleteUser };
