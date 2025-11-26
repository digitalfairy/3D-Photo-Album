import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes.js'; 
// import { createClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; // REMOVE CLERK
import { auth } from 'express-oauth2-jwt-bearer'; // 1. ADD AUTH0 IMPORT
import * as dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI;

// 2. UPDATE CORS: Include local frontend port 5173
const allowedOrigins = [
    'https://app.anitacreativestudio.com',           
    'https://photo-gallery-frontend-steel.vercel.app', 
    'http://localhost:5173' // Changed from 3000 to 5173
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions)); 

app.use(express.json()); 

// 3. INITIALIZE AUTH0 JWT VALIDATION MIDDLEWARE (checkJwt)
const checkJwt = auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    audience: process.env.AUTH0_AUDIENCE,
});

// 4. Apply Image Routes (passing the new checkJwt middleware)
app.use('/api/images', imageRoutes(checkJwt)); 

const connectDB = async () => { 
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.send('Book Slider API is running!');
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
});