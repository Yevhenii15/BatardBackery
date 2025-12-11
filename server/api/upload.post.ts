// server/api/upload.post.ts
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  bodyParser: false,
};

export default defineEventHandler(async (event) => {
  // ✅ Always use <project root>/public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("[upload] created uploadDir:", uploadDir);
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });

  try {
    const data = await new Promise<{ url: string }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) {
          console.error("[upload] formidable error:", err);
          return reject(err);
        }

        // 🔁 Delete old file(s) if oldUrl provided
        if (fields.oldUrl) {
          const oldUrls = Array.isArray(fields.oldUrl)
            ? fields.oldUrl
            : [fields.oldUrl];

          oldUrls.forEach((urlStr) => {
            const clean = String(urlStr).replace(/^\/+/g, ""); // remove leading "/"
            const oldFilePath = path.join(
              process.cwd(),
              "public",
              clean // e.g. "uploads/xxx.png"
            );

            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
              console.log("[upload] deleted old file:", oldFilePath);
            }
          });
        }

        // ✅ Get uploaded file (same pattern as old working code)
        const allFiles = files as any;
        let file: File;

        if (Array.isArray(allFiles.file)) {
          file = allFiles.file[0] as File;
        } else if (allFiles.file) {
          file = allFiles.file as File;
        } else {
          return reject(new Error("No file uploaded"));
        }

        console.log("[upload] saved file at:", file.filepath);

        const fileUrl = `/uploads/${path.basename(file.filepath)}`;
        console.log("[upload] returning URL:", fileUrl);

        resolve({ url: fileUrl });
      });
    });

    return data;
  } catch (err) {
    console.error("[upload] Upload error:", err);
    setResponseStatus(event, 500);
    return { message: "Upload failed" };
  }
});
