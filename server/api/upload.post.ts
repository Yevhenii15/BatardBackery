// server/api/upload.post.ts
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { readMultipartFormData } from "h3";

export const config = {
  bodyParser: false,
};

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export default defineEventHandler(async (event) => {
  // Ensure upload dir exists (works on Render too, assuming writable disk)
  await fsp.mkdir(uploadDir, { recursive: true });

  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No form data" });
  }

  // Get the file part (same field name as in your composable: "file")
  const filePart = formData.find((p) => p.type === "file" && p.name === "file");
  if (!filePart) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  // Optional oldUrl field (string)
  const oldUrlPart = formData.find((p) => p.name === "oldUrl");

  // Generate new file name
  const original = filePart.filename || "upload";
  const ext = path.extname(original);
  const fileName =
    Date.now().toString(36) + "-" + Math.random().toString(16).slice(2) + ext;

  const filePath = path.join(uploadDir, fileName);

  // Save file
  await fsp.writeFile(filePath, filePart.data);
  console.log("[upload] saved:", filePath);

  // Delete old file if oldUrl was provided
  if (oldUrlPart?.data) {
    const oldUrl = oldUrlPart.data.toString("utf8"); // e.g. "/uploads/abc.png"
    const clean = oldUrl.replace(/^\/+/, ""); // remove leading /
    const oldFilePath = path.join(uploadDir, path.basename(clean));
    if (fs.existsSync(oldFilePath)) {
      await fsp.unlink(oldFilePath);
      console.log("[upload] deleted old:", oldFilePath);
    }
  }

  // We’ll serve from a dynamic route: /uploads/:name
  const fileUrl = `/uploads/${fileName}`;

  return { url: fileUrl };
});
