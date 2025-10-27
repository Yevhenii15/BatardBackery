import { connectDB } from "../../server/utils/db";

export default defineEventHandler(async () => {
  await connectDB();
  return { message: "MongoDB connected successfully 🎉" };
});
