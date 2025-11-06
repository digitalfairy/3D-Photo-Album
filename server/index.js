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

const requireAuthMiddleware = createClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
    jwksUrl: process.env.CLERK_JWKS_URL, 
    jwtKey: 'long-lasting', 
});

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions)); 

app.use('/api/images', imageRoutes(requireAuthMiddleware)); 

app.use(express.json()); 

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