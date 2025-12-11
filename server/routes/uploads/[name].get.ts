// server/routes/uploads/[name].get.ts
import fs from "fs";
import path from "path";
import mime from "mime-types";

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export default defineEventHandler((event) => {
  const name = getRouterParam(event, "name");
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Missing file name" });
  }

  const filePath = path.join(uploadDir, name);

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  const contentType = mime.lookup(name) || "application/octet-stream";
  setResponseHeader(event, "Content-Type", contentType);

  const stream = fs.createReadStream(filePath);
  return sendStream(event, stream);
});
