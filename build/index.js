"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const visitRoutes_1 = __importDefault(require("./routes/visitRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const disputeRoutes_1 = __importDefault(require("./routes/disputeRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Healthcheck Route
app.get('/health', async (req, res) => {
    try {
        const [rows] = await db_1.dbPool.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'ok', db: 'connected' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});
// Rutas API
app.use('/api/auth', authRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/visits', visitRoutes_1.default);
app.use('/api/logs', logRoutes_1.default);
app.use('/api/disputes', disputeRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
