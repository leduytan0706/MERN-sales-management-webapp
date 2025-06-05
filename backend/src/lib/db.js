import mongoose from "mongoose";

const connectStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sales-management'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(connectStr);
        console.log(`MongoDB connected succcessfully.`);
    } catch (error) {
        console.log(`MongoDB connection error: ${error}`);
    }
};

export default connectDB;