/**
 * @openapi
 * /api/category:
 *   get:
 *     summary: List all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Array of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *         description: No categories found
 */

import Category from "../../models/Category";

export default defineEventHandler(async (event) => {
  const categories = await Category.find({}, { __v: 0 }).lean();

  if (!categories || categories.length === 0) {
    setResponseStatus(event, 404);
    return { message: "No categories found" };
  }

  setHeader(event, "Cache-Control", "public, max-age=30");

  return categories;
});
