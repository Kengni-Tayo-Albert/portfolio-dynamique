import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const uploadDirectory = path.resolve(currentDirectory, "../../public/uploads");

const allowedMimeTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function createUploadError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getBase64Content(dataUrl) {
  const [, base64Content] = String(dataUrl || "").split(",");

  return base64Content || dataUrl;
}

function buildPublicUrl(req, fileName) {
  const host = req.get("host");
  const protocol = req.get("x-forwarded-proto") || req.protocol;

  return `${protocol}://${host}/uploads/${fileName}`;
}

export async function uploadAdminImage(req, res, next) {
  try {
    const { fileName, mimeType, data } = req.body;
    const extension = allowedMimeTypes[mimeType];

    if (!extension) {
      throw createUploadError("Format d'image non autorise.");
    }

    if (!data) {
      throw createUploadError("Aucune image recue.");
    }

    const imageBuffer = Buffer.from(getBase64Content(data), "base64");
    const maxSizeInBytes = 3 * 1024 * 1024;

    if (imageBuffer.length > maxSizeInBytes) {
      throw createUploadError("L'image ne doit pas depasser 3 Mo.");
    }

    const safeName = String(fileName || "projet")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const finalFileName = `${Date.now()}-${safeName || "image"}-${crypto.randomUUID()}.${extension}`;
    const finalPath = path.join(uploadDirectory, finalFileName);

    await fs.mkdir(uploadDirectory, { recursive: true });
    await fs.writeFile(finalPath, imageBuffer);

    res.status(201).json({
      imageUrl: buildPublicUrl(req, finalFileName),
      fileName: finalFileName,
    });
  } catch (error) {
    next(error);
  }
}
