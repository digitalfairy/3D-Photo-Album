// server/routes/imageRoutes.js

import express from 'express';
import upload from '../config/multer.js'; // NOTE: This must now use memoryStorage
import { uploadImage } from '../config/cloudinary.js';
import UserImage from '../models/Image.js';
// import fs from 'fs/promises'; // REMOVED: No longer needed with memory storage

const router = express.Router();

/**
 * @param {function} requireAuth 
 * @returns {express.Router} 
 */
const imageRoutes = (requireAuth) => {
    
    router.post('/upload', 
        upload.single('image'), // Multer middleware now places the file in req.file.buffer
        requireAuth, 
        
        async (req, res) => {
            const userId = req.auth?.userId; 
            
            try {
                if (!userId) {
                    return res.status(401).json({ error: 'Authentication token missing or invalid.' });
                }
                if (!req.file) {
                    return res.status(400).json({ error: 'No file was uploaded. Check formData field name ("image").' });
                }

                // 1. Convert file buffer to a Data URI for direct upload to Cloudinary
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;

                const uploadResult = await uploadImage(
                    dataURI, // Pass the Data URI to Cloudinary
                    userId 
                );
                
                // 2. Removed file system cleanup (fs.unlink) - not needed with memory storage

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
                
                // 3. Removed file cleanup error handling - not needed with memory storage
                
                return res.status(error.status || 500).json({ 
                    error: 'Server error during upload or save.', 
                    details: error.message 
                });
            }
        }
    ); 
    
    // Existing route to fetch user images
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