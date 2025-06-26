import express, { response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import supplierRouter from './routes/supplier.route.js';
import productRouter from './routes/product.route.js';
import importRouter from './routes/import.route.js';
import orderRouter from './routes/order.route.js';
import analyticRouter from './routes/report.route.js';
import discountRouter from './routes/discount.route.js';
import connectDB from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Định nghĩa __filename và __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau."
});

app.use(limiter);

app.use(cors({
    origin: process.env.CLIENT_URL, // Chỉ cho phép từ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'], // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Header được phép
}));


app.use(express.json({ limit: '10mb' }));  // Tăng giới hạn JSON lên 10MB
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.use('/api/category', categoryRouter);

app.use('/api/supplier', supplierRouter);

app.use('/api/product', productRouter);

app.use('/api/discount', discountRouter);

app.use('/api/import', importRouter);

app.use('/api/order', orderRouter);

app.use('/api/reports', analyticRouter);


// --- Serve React static files ---
// app.use(express.static(path.join(__dirname, '../../frontend/vite-project/dist')));

// Bắt tất cả các request không phải API trả về React index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/vite-project/dist', 'index.html'));
// });

// middleware only executed if there's an error passed
app.use((error, req, res, next) => {
    if (res.headerSent){
        return next(error);
    }
    console.error(err); // Để bạn debug

    const statusCode = typeof err.status === 'number'
        ? err.status
        : err.code === 'ENOENT'
        ? 404
        : 500;

    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});