import Booking from "../../models/Booking";
import Product from "../../models/Product";
import { Types } from "mongoose";

interface BodyItem {
  productId: string;
}

interface CheckCapacityBody {
  date: string; // "2025-11-28"
  items: BodyItem[]; // products currently in the cart
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CheckCapacityBody>(event);
  const { date, items } = body;

  if (!date || !items || !items.length) {
    setResponseStatus(event, 400);
    return { message: "date and items are required" };
  }

  const productIds = [...new Set(items.map((i) => i.productId))].map(
    (id) => new Types.ObjectId(id)
  );

 
  const existing = await Booking.aggregate([
    { $match: { "pickups.date": date } }, 
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        alreadyBooked: { $sum: "$items.quantity" },
      },
    },
  ]);

  const alreadyMap = new Map<string, number>();
  for (const row of existing) {
    alreadyMap.set(String(row._id), row.alreadyBooked);
  }

  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const result: Record<
    string,
    {
      capacity: number;
      stock: number;
      alreadyBooked: number;
      remaining: number;
    }
  > = {};

  for (const p of products) {
    const id = String(p._id);

    const cap =
      typeof p.dailyCapacity === "number" ? p.dailyCapacity : Infinity;
    const stock = typeof p.stock === "number" ? p.stock : Infinity;
    const max = Math.min(cap, stock);

    const already = alreadyMap.get(id) ?? 0;
    const remaining = Math.max(max - already, 0);

    result[id] = {
      capacity: cap,
      stock,
      alreadyBooked: already,
      remaining,
    };
  }

  return { ok: true, byProduct: result };
});
