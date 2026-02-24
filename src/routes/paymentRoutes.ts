import { Router } from 'express';
import { sendFinalQuote, acceptFinalQuoteAndPay, approveJobCompletion } from '../controllers/paymentController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// El profesional envía el costo de Mano de Obra + Materiales
router.post('/quote/final', authenticateJWT, requireRole('professional'), sendFinalQuote);

// El cliente acepta la cotización final y los fondos se bloquean en Escrow
router.post('/quote/accept', authenticateJWT, requireRole('client'), acceptFinalQuoteAndPay);

// El cliente da el OK final y se libera el dinero del Escrow al Profesional
router.post('/release', authenticateJWT, requireRole('client'), approveJobCompletion);

export default router;
