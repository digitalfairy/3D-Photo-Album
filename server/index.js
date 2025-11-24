import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes.js'; 
import { createClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; 
import * as dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI;

const allowedOrigins = [
  'https://app.anitacreativestudio.com',           
  'https://photo-gallery-frontend-steel.vercel.app', 
  'http://localhost:3000'
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

// 1. Apply CORS middleware globally
app.use(cors(corsOptions)); 

app.use(express.json()); 

// 2. CRITICAL FIX: Custom middleware to bypass Clerk authentication for OPTIONS preflights.
// This must run *before* the Clerk middleware is applied to the routes.
app.use('/api/images', (req, res, next) => {
    // If it's the OPTIONS method, return 200 immediately.
    // The CORS headers were already set by app.use(cors(corsOptions)) above.
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); 
    }
    next();
});

// 3. Initialize Clerk authentication middleware
const requireAuthMiddleware = createClerkExpressRequireAuth({
    jwtKey: 'long-lasting', 
});

// 4. Apply Image Routes (which includes the requireAuthMiddleware on specific paths)
app.use('/api/images', imageRoutes(requireAuthMiddleware)); 

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