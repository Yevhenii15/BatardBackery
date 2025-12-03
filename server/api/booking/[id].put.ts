/**
 * @openapi
 * /api/booking/{id}:
 *   put:
 *     summary: Update booking (status/archive)
 *     tags: [Booking]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *               archived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
import Booking from "../../models/Booking";
import Product from "../../models/Product";
import { BookingUpdateInput } from "../../validation/Booking";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const { id } = event.context.params!;
  const body = await readBody(event);
  const input = BookingUpdateInput.parse(body);

  const booking = await Booking.findById(id);
  if (!booking) {
    setResponseStatus(event, 404);
    return { message: "Booking not found" };
  }

  // 🔹 Remember old status before changes
  const previousStatus = booking.status;

  if (input.status) {
    booking.status = input.status;

    // auto-archive when completed or cancelled
    if (
      (input.status === "completed" || input.status === "cancelled") &&
      !booking.archived
    ) {
      booking.archived = true;
      booking.set("archivedAt", new Date());
    }

    if (input.status === "pending" || input.status === "confirmed") {
      // if you ever "reopen" a booking
      booking.archived = false;
      booking.set("archivedAt", null);
    }
  }

  if (typeof input.archived === "boolean") {
    booking.archived = input.archived;
    booking.set("archivedAt", input.archived ? new Date() : null);
  }

  // 🔹 Decide if we need to adjust stock based on status transition
  const newStatus = booking.status;

  const wentToCancelled =
    previousStatus !== "cancelled" && newStatus === "cancelled";

  const leftCancelled =
    previousStatus === "cancelled" && newStatus !== "cancelled";

  if (wentToCancelled || leftCancelled) {
    const sign = wentToCancelled ? +1 : -1; // +1 return stock, -1 use stock again

    const qtyByProduct = new Map<string, number>();

    for (const item of booking.items as any[]) {
      const pid = String(item.productId);
      const q = typeof item.quantity === "number" ? item.quantity : 1;
      const current = qtyByProduct.get(pid) ?? 0;
      qtyByProduct.set(pid, current + q);
    }

    for (const [productId, qty] of qtyByProduct.entries()) {
      if (!qty) continue;

      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: sign * qty } }
      );
    }
  }

  await booking.save();
  return booking.toObject();
});
