import express from 'express';
import upload from '../config/multer.js'; 
import { uploadImage } from '../config/cloudinary.js';
import UserImage from '../models/Image.js';
import fs from 'fs/promises'; 

const router = express.Router();

/**
 * @param {function} requireAuth 
 * @returns {express.Router} 
 */
const imageRoutes = (requireAuth) => {
    
    router.post('/upload', 

        upload.single('image'),

        requireAuth, 
        
        async (req, res) => {
            const userId = req.auth?.userId; 
            let filePath = req.file?.path; 

            try {
                if (!userId) {
                    return res.status(401).json({ error: 'Authentication token missing or invalid.' });
                }
                if (!req.file) {
                    return res.status(400).json({ error: 'No file was uploaded. Check formData field name ("image").' });
                }

                const uploadResult = await uploadImage(
                    filePath, 
                    userId 
                );
                
                await fs.unlink(filePath); 
                filePath = null; 

                const newImage = new UserImage({
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    userId: userId, 
                    fileName: req.file.originalname, 
                });

                await newImage.save();

                return res.status(201).json({
                    message: 'Upload Success!',
                    url: newImage.url,
                    id: newImage._id,
                });
                
            } catch (error) {
                console.error("Upload process failed:", error);
                
                if (filePath) { 
                    try { await fs.unlink(filePath); } catch (cleanupError) { 
                        console.error("Temporary file cleanup failed:", cleanupError.message); 
                    }
                }
                
                return res.status(error.status || 500).json({ 
                    error: 'Server error during upload or save.', 
                    details: error.message 
                });
            }
        }
    ); 
    
    router.get('/me', requireAuth, async (req, res) => { 
        const userId = req.auth.userId; 
        
        try {
            const userImages = await UserImage.find({ userId }).sort({ createdAt: 1 }).exec();

            const pageData = userImages.map(img => ({
                id: img._id,
                url: img.url,
            }));
            
            res.status(200).json(pageData); 
            
        } catch (error) {
            console.error("Fetch error:", error);
            res.status(500).json({ error: 'Failed to retrieve user images.', details: error.message });
        }
    });
    
    router.get('/test', (req, res) => {
        res.send('Image API Router is Active');
    });

    return router;
};

export default imageRoutes;