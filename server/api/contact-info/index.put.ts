/**
 * @openapi
 * /api/contact-info:
 *   put:
 *     summary: Create or update Contact Info
 *     tags: [ContactInfo]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfo'
 *     responses:
 *       200:
 *         description: Updated or created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactInfo'
 *       401: { description: Unauthorized }
 */

import ContactInfo from "../../models/ContactInfo";
import { ContactInfoInput } from "../../validation/ContactInfo";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const body = await readBody(event);
  const input = ContactInfoInput.parse(body);

  const info = await ContactInfo.findOneAndUpdate({}, input, {
    new: true,
    upsert: true,
  }).lean();

  return info;
});
