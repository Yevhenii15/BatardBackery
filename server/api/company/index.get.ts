/**
 * @openapi
 * /api/company:
 *   get:
 *     summary: Get company information
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Returns company info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company info not found
 */

import Company from "../../models/Company";

export default defineEventHandler(async (event) => {
  const company = await Company.findOne({}, { __v: 0 }).lean();
  if (!company) {
    setResponseStatus(event, 404);
    return { message: "Company info not found" };
  }
  setHeader(event, "Cache-Control", "public, max-age=30");
  return company;
});
