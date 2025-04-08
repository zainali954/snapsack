import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Function to configure Cloudinary
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Upload function
export const uploadToCloudinary = async (filePath, folder = 'general') => {
  try {
    configureCloudinary();

    const result = await cloudinary.uploader.upload(filePath, { folder });
    // fs.unlinkSync(filePath); // Remove the file after upload
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
