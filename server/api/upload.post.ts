import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  bodyParser: false,
};

export default defineEventHandler(async (event) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  const data = await new Promise<{ url: string }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) return reject(err);

      if (fields.oldUrl) {
        const oldUrls = Array.isArray(fields.oldUrl)
          ? fields.oldUrl
          : [fields.oldUrl];

        oldUrls.forEach((urlStr) => {
          const clean = String(urlStr).replace(/^\/+/g, "");
          const oldFilePath = path.join(process.cwd(), "public", clean);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log("Deleted old file:", oldFilePath);
          }
        });
      }

      let file: File;
      const anyFiles = files as any;

      if (Array.isArray(anyFiles.file)) {
        file = anyFiles.file[0] as File;
      } else if (anyFiles.file) {
        file = anyFiles.file as File;
      } else {
        return reject(new Error("No file uploaded"));
      }

      const fileUrl = `/uploads/${path.basename(file.filepath)}`;
      resolve({ url: fileUrl });
    });
  });

  return data;
});
