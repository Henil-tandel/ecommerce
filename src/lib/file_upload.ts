import { v4 as uuidv4 } from "uuid";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "./cloudinary";

// Upload single file
export const uploadSingleFile = async (buffer: Buffer, folder: string) => {
  const public_id = `${folder}/${uuidv4()}`;
  return uploadToCloudinary(buffer, folder, public_id);
};

// Upload multiple files
export const uploadMultipleFiles = async (files: Express.Multer.File[], folder: string) => {
  const uploads = files.map(async (file) => {
    const public_id = `${folder}/${uuidv4()}`;
    return uploadToCloudinary(file.buffer, folder, public_id);
  });
  return Promise.all(uploads);
};

// Delete single file
export const deleteSingleFile = async (publicId: string) => {
  return deleteFromCloudinary(publicId);
};

// Delete multiple files
export const deleteMultipleFiles = async (publicIds: string[]) => {
  return deleteMultipleFromCloudinary(publicIds);
};

// Update single file
export const updateSingleFile = async (buffer: Buffer, folder: string, oldPublicId?: string) => {
  if (oldPublicId) await deleteSingleFile(oldPublicId);
  return uploadSingleFile(buffer, folder);
};

// Update multiple files
export const updateMultipleFiles = async (newFiles: Express.Multer.File[], folder: string, oldPublicIds?: string[]) => {
  if (oldPublicIds && oldPublicIds.length > 0) await deleteMultipleFiles(oldPublicIds);
  return uploadMultipleFiles(newFiles, folder);
};
