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
  await fsp.mkdir(uploadDir, { recursive: true });

  const formData = await readMultipartFormData(event);

  // 🟡 Add this log here — right after reading form data
  console.log(
    formData?.map((p) => ({
      name: p.name,
      filename: p.filename,
      type: p.type,
      dataLen: p.data?.length,
    }))
  );

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No form data" });
  }

  // Now your normal logic
  const filePart = formData.find((p) => p.filename && p.name === "file");
  if (!filePart) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const oldUrlPart = formData.find((p) => p.name === "oldUrl" && !p.filename);

  const original = filePart.filename || "upload";
  const ext = path.extname(original);
  const fileName =
    Date.now().toString(36) + "-" + Math.random().toString(16).slice(2) + ext;

  const filePath = path.join(uploadDir, fileName);
  await fsp.writeFile(filePath, filePart.data);
  console.log("[upload] saved:", filePath);

  if (oldUrlPart?.data) {
    const oldUrl = oldUrlPart.data.toString("utf8");
    const clean = oldUrl.replace(/^\/+/, "");
    const oldFilePath = path.join(uploadDir, path.basename(clean));
    if (fs.existsSync(oldFilePath)) {
      await fsp.unlink(oldFilePath);
      console.log("[upload] deleted old:", oldFilePath);
    }
  }

  const fileUrl = `/uploads/${fileName}`;
  return { url: fileUrl };
});
