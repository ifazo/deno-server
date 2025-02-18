import { ObjectId } from "mongodb";
import { products, redis } from "../db.ts";

async function addProduct(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await products.insertOne(body);
    await redis.del("products");
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

async function getProducts(): Promise<Response> {
  try {
    const cachedProducts = await redis.get("products");
    if (cachedProducts) {
      return new Response(cachedProducts, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await products.find().toArray();
    await redis.set("products", JSON.stringify(result));
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

async function getProduct(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const cachedProduct = await redis.get(`product:${id}`);
    if (cachedProduct) {
      return new Response(cachedProduct, {
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await products.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.set(`product:${id}`, JSON.stringify(result));
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

async function updateProduct(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();
    const result = await products.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`product:${id}`);
    await redis.del("products");
    return new Response(JSON.stringify({ message: "Product updated" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function deleteProduct(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const result = await products.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await redis.del(`product:${id}`);
    await redis.del("products");
    return new Response(JSON.stringify({ message: "Product deleted" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export { addProduct, getProducts, getProduct, updateProduct, deleteProduct };
