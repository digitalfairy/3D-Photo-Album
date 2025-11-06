import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        index: true, 
    },
    fileName: {
        type: String,
        trim: true,
        default: 'User Upload',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const UserImage = mongoose.model('UserImage', ImageSchema);
export default UserImage;