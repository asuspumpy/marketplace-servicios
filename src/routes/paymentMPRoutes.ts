import { Router } from 'express';
import { createPreference, mpWebhookHandler } from '../controllers/paymentMPController';

const router = Router();

// /api/payments/create-preference
router.post('/create-preference', createPreference);

// /api/webhooks/mercadopago
router.post('/mercadopago', mpWebhookHandler);

export default router;
