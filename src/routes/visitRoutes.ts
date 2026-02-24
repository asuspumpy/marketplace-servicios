import { Router } from 'express';
import { offerVisit, acceptVisitAndPay } from '../controllers/visitController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para que un profesional ofrezca una visita técnica (fijando precio)
router.post('/offer', authenticateJWT, requireRole('professional'), offerVisit);

// Endpoint para que el cliente acepte la visita y pague (retiene en Escrow)
router.post('/accept', authenticateJWT, requireRole('client'), acceptVisitAndPay);

export default router;
