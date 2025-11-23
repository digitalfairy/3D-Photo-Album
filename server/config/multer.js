// server/config/multer.js

import multer from 'multer';

// Switch from diskStorage to memoryStorage
// This stores the file buffer directly in RAM, avoiding file system I/O, 
// which is required for ephemeral environments like Render.
const storage = multer.memoryStorage();

// Multer initialization remains the same
const upload = multer({ storage: storage });

export default upload;