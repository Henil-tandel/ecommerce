import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  public_id?: string
) => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id },
      (err, result) => {
        if (err || !result) return reject(err || "Upload failed");

        const match = result.secure_url.match(
          /res\.cloudinary\.com\/[^/]+\/(.+)$/
        );
        const shortPath = match ? match[1] : result.secure_url;

        resolve({ url: shortPath, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export const deleteMultipleFromCloudinary = async (publicIds: string[]) => {
  return cloudinary.api.delete_resources(publicIds);
};
