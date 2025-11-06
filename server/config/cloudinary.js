import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'; 

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * @param {string} filePath  
 * @param {string} folder 
 * @returns {Promise<object>} 
*/

export const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `book-slider/${folder}`, 
            resource_type: "image",
            quality: "auto:low", 
            timeout: 60000
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to cloud storage.");
    }
};

export default cloudinary;