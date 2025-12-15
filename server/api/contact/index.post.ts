/**
 * @openapi
 * /api/contact:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ContactMessage' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactMessage' }
 */

import Contact from "../../models/Contact";
import { ContactCreateInput } from "../../validation/Contact";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const input = ContactCreateInput.parse(body);

  const doc = await Contact.create(input);
  setResponseStatus(event, 201);
  return doc.toObject();
});
