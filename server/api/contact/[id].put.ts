/**
 * @openapi
 * /api/contact/{id}:
 *   put:
 *     summary: Update a contact message (status/note)
 *     tags: [Contact]
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
 *               status: { type: string, enum: [open,in_progress,closed] }
 *               adminNote: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactMessage' }
 *       404: { description: Not found }
 */

import Contact from "../../models/Contact";
import { ContactUpdateInput } from "../../validation/Contact";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const { id } = event.context.params!;
  const body = await readBody(event);
  const input = ContactUpdateInput.parse(body);

  const update: any = { ...input };

  if (input.status) {
    if (input.status === "closed") {
      update.closedAt = new Date(); 
    } else {
      update.closedAt = null; 
    }
  }

  const doc = await Contact.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!doc) {
    setResponseStatus(event, 404);
    return { message: "Not found" };
  }
  return doc;
});
