/**
 * @openapi
 * /api/product:
 *   post:
 *     summary: Create a product
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Created product
 *       400:
 *         description: Category does not exist
 *       401: { description: Unauthorized }
 */
import Product from "../../models/Product";
import Category from "../../models/Category";
import { ProductInput } from "../../validation/Product";
import { requireAdmin } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const body = await readBody(event);
  const input = ProductInput.parse(body);

  const categoryExists = await Category.exists({ _id: input.categoryId });
  if (!categoryExists) {
    setResponseStatus(event, 400);
    return { message: "Category does not exist" };
  }

  const created = await Product.create(input);
  setResponseStatus(event, 201);
  return created.toObject();
});