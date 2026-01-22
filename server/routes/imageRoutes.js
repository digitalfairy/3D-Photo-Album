// server/routes/imageRoutes.js

import express from 'express';
import upload from '../config/multer.js';
import { uploadImage } from '../config/cloudinary.js';
import UserImage from '../models/Image.js';
import { checkScopes } from '../utils/permissionMiddleware.js'; // <-- NEW: Import scope checker

const router = express.Router();

/**
 * @param {function} checkJwt - The Auth0 JWT validation middleware from index.js
 * @returns {express.Router} 
 */
const imageRoutes = (checkJwt) => {
    
    // --- POST /upload Route ---
    // Requires a valid JWT (checkJwt) AND the 'write:photos' scope

    // TEST
    router.post('/upload', 
        checkJwt, 
        checkScopes(['write:photos']), // <-- APPLY WRITE SCOPE CHECK
        upload.single('image'), 
        
        async (req, res) => {
            // The request reaches here only if the token is valid AND has the scope.
            const userId = req.auth?.payload?.sub; 
            
            try {
                if (!userId) {
                    // This error should rarely hit, as checkJwt should handle it
                    return res.status(401).json({ error: 'Authentication token missing or invalid.' });
                }
                if (!req.file) {
                    return res.status(400).json({ error: 'No file was uploaded. Check formData field name ("image").' });
                }

                // Upload logic
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;

                const uploadResult = await uploadImage(dataURI, userId);
                
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
                return res.status(error.status || 500).json({ 
                    error: 'Server error during upload or save.', 
                    details: error.message 
                });
            }
        }
    ); 
    
    // --- GET /me Route ---
    // Requires a valid JWT (checkJwt) AND the 'read:photos' scope
    router.get('/me', 
        checkJwt, // <-- APPLY JWT CHECK
        checkScopes(['read:photos']), // <-- APPLY READ SCOPE CHECK
        async (req, res) => { 
            const userId = req.auth.payload.sub; // Correctly retrieve user ID
            
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
        }
    );
    
    // --- GET /public Route ---
    // Unprotected route for fetching non-user-specific content
    router.get('/public', async (req, res) => {
        // ... (Logic for public images)
        res.status(200).json([]);
    });
    
    router.get('/test', (req, res) => {
        res.send('Image API Router is Active');
    });

    return router;
};

export default imageRoutes;