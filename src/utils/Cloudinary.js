import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dw9yboxwi",
  api_key: process.env.Cloudinary_API_Key,
  api_secret: process.env.Cloudinary_Secret, 
});

// Upload an image

const uploadFile = async (localFilePath) => {
  try {
    console.log(localFilePath);
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded:", uploadResult.url);
    return uploadResult
  } catch (error) {
    fs.unlinkSync("Error in uploading file to cloundinary:", localFilePath);
    return null;
  }
};

export default uploadFile;
