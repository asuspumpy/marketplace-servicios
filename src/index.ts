import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { dbPool } from './config/db';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import visitRoutes from './routes/visitRoutes';
import logRoutes from './routes/logRoutes';
import disputeRoutes from './routes/disputeRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck Route
app.get('/health', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'ok', db: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Configuración para servir archivos estáticos (el frontend de React)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Catch-all Route for React SPA (Client-side routing fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
