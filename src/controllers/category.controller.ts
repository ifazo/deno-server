import { ObjectId } from "mongodb";
import { categories, redis } from "../db.ts";

async function addCategory(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await categories.insertOne(body);
    await redis.del("categories");
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

async function getCategories(): Promise<Response> {
  try {
    const cachedCategories = await redis.get("categories");
    if (cachedCategories) {
      return new Response(cachedCategories, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await categories.find().toArray();
    await redis.set("categories", JSON.stringify(result));
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

async function getCategory(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const cachedCategory = await redis.get(`category:${id}`);
    if (cachedCategory) {
      return new Response(cachedCategory, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await categories.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.set(`category:${id}`, JSON.stringify(result));
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

async function updateCategory(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();
    const result = await categories.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`category:${id}`);
    await redis.del("categories");
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

async function deleteCategory(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const result = await categories.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`category:${id}`);
    await redis.del("categories");
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

export {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
