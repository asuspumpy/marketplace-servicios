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

// Configuración de CORS basada en entorno
const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:5173']; // Puerto por defecto de Vite

app.use(cors({
    origin: corsOrigins,
    credentials: true
}));

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

// En Hostinger/Producción, el servidor frontend separado (Apache) sirve los estáticos de React.
// Por precaución, devolvemos un mensaje a quien intente entrar a la raíz de la API directamente.
app.get('/', (req, res) => {
    res.json({ message: 'Marketplace API is running v1.0.0' });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
