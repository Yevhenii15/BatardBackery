/**
 * @openapi
 * /api/booking/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Booking not found
 */
import Booking from "../../models/Booking";
import Product from "../../models/Product";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;

  const booking = await Booking.findById(id);
  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }

  // 🔹 If booking is not cancelled yet, return stock before deleting
  if (booking.status !== "cancelled") {
    const qtyByProduct = new Map<string, number>();

    for (const item of booking.items as any[]) {
      const pid = String(item.productId);
      const q = typeof item.quantity === "number" ? item.quantity : 1;
      const current = qtyByProduct.get(pid) ?? 0;
      qtyByProduct.set(pid, current + q);
    }

    for (const [productId, qty] of qtyByProduct.entries()) {
      if (!qty) continue;

      await Product.updateOne({ _id: productId }, { $inc: { stock: qty } });
    }
  }

  await booking.deleteOne();

  return { ok: true };
});
