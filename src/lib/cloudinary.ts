import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (fileUri: string) => {
  try {
    if (!fileUri) return null;

    const response = await cloudinary.uploader.upload(fileUri, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "school-finder",
    });

    return response;
  } catch (err) {
    console.log("Error occured while uploading to cloudinary\n", err);
  }
};
