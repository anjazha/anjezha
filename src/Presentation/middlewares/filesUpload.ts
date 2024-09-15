import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { safePromise } from "@/helpers/safePromise";
import { HTTP500Error } from "@/helpers/ApiError";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fieldSize: 5 * 1025 * 1024 } }); // files size limit will be 5MB

cloudinary.config({
  secure: true,
});


const uploadBuffer = (file:any) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: file.mimetype.split("/")[0],
        folder: `anjezha/${file.collectionName}`,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.secure_url); // Capture the secure URL here
      }
    );

    uploadStream.end(file.buffer); // Pass the image buffer to the stream
  });
};

const uploadToCloudinary =
  (collectionName:any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      if (files.length > 0) {
        const attachments = [];
        for (const file of files) {
          const [error, fileUrl] = await safePromise(() =>
            uploadBuffer({ ...file, collectionName })
          );
          console.log(error, fileUrl);
          if (error)
            return next(
              new HTTP500Error(
                "Error uploading file to cloudinary " + error.message
              )
            );
          attachments.push({
            file_path: fileUrl,
            file_type: file.mimetype,
            file_size: Math.round(file.size / 1024),
          });
        }
        // console.log(attachments);
      req.body.attachments = attachments;
      }
    }
      next();

    //   console.log();
  };

export const filesUpload = (fieldName: string, collectionName: string) => {
  return [upload.array(fieldName, 5), uploadToCloudinary(collectionName)]; // 5 files can be uploaded at a time
};
