/**
 * @openapi
 * /api/hero:
 *   get:
 *     summary: Get the current Hero Section
 *     tags: [Hero]
 *     responses:
 *       200:
 *         description: Returns the single hero section
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HeroSection'
 *       404:
 *         description: Hero section not found
 */

import Hero from "../../models/HeroSection";

export default defineEventHandler(async (event) => {
  const hero = await Hero.findOne().lean();
  if (!hero) {
    setResponseStatus(event, 404);
    return { message: "Hero section not found" };
  }
  setHeader(event, "Cache-Control", "public, max-age=30");
  return hero;
});
