import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  bodyParser: false,
};

function getUploadDir() {
  const cwd = process.cwd();

  // In dev, cwd is project root → /public is correct
  // In production (Render), cwd is usually .output/server → we need ../public
  const isOutput = cwd.includes(".output");

  const publicDir = isOutput
    ? path.join(cwd, "..", "public") // => .output/public
    : path.join(cwd, "public"); // => project/public

  const uploadDir = path.join(publicDir, "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
}

export default defineEventHandler(async (event) => {
  const uploadDir = getUploadDir();

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  try {
    const result = await new Promise<{ url: string }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) return reject(err);

        // ---- delete old file if oldUrl passed ----
        const oldField = fields.oldUrl;
        if (oldField) {
          const oldUrls = Array.isArray(oldField) ? oldField : [oldField];
          for (const old of oldUrls) {
            const clean = String(old).replace(/^\//, "");
            // IMPORTANT: delete from the SAME public dir root
            const oldPath = path.join(
              uploadDir,
              "..",
              clean.replace(/^uploads\//, "")
            );
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        }

        // ---- get uploaded file safely ----
        let file: File | undefined;
        const filesAny = files as any;
        const fileField = filesAny.file;

        if (Array.isArray(fileField)) {
          file = fileField[0] as File;
        } else if (fileField) {
          file = fileField as File;
        }

        if (!file) {
          return reject(new Error("No file uploaded"));
        }

        const url = `/uploads/${path.basename(file.filepath)}`;
        resolve({ url });
      });
    });

    return result;
  } catch (err) {
    console.error("Upload error:", err);
    setResponseStatus(event, 500);
    return { message: "Upload failed" };
  }
});
