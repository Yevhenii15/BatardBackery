// server/api/upload.post.ts
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  bodyParser: false,
};

// 👇 This will work both locally and in Render's .output structure
function getPublicRoot() {
  const cwd = process.cwd();

  // In production (Nuxt build) cwd is usually .output/server
  const isOutput = cwd.includes(".output");

  if (isOutput) {
    // .output/server  -> public files live in .output/public
    return path.join(cwd, "..", "public");
  }

  // Local dev: cwd = project root
  return path.join(cwd, "public");
}

export default defineEventHandler(async (event) => {
  const publicRoot = getPublicRoot();
  const uploadDir = path.join(publicRoot, "uploads");

  // Debug logs – will appear in Render logs
  console.log("[upload] process.cwd() =", process.cwd());
  console.log("[upload] publicRoot   =", publicRoot);
  console.log("[upload] uploadDir    =", uploadDir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("[upload] created uploadDir");
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

        // 🔁 Delete old file if oldUrl is provided
        if (fields.oldUrl) {
          const oldUrls = Array.isArray(fields.oldUrl)
            ? fields.oldUrl
            : [fields.oldUrl];

          for (const urlStr of oldUrls) {
            const clean = String(urlStr).replace(/^\/+/g, ""); // remove leading slash
            const oldPath = path.join(publicRoot, clean); // /public + uploads/xxx.png

            console.log("[upload] trying to delete old file:", oldPath);

            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
              console.log("[upload] deleted old file:", oldPath);
            }
          }
        }

        // ✅ Get uploaded file
        const allFiles = files as any;
        let file: File | undefined;

        if (Array.isArray(allFiles.file)) {
          file = allFiles.file[0] as File;
        } else if (allFiles.file) {
          file = allFiles.file as File;
        }

        if (!file) {
          return reject(new Error("No file uploaded"));
        }

        console.log("[upload] saved file at:", file.filepath);

        // We always serve uploads as /uploads/<filename>
        const fileUrl = `/uploads/${path.basename(file.filepath)}`;
        console.log("[upload] returned url:", fileUrl);

        resolve({ url: fileUrl });
      });
    });

    return data;
  } catch (err) {
    console.error("Upload error:", err);
    setResponseStatus(event, 500);
    return { message: "Upload failed" };
  }
});
