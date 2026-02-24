import { Router } from 'express';
import { postReview } from '../controllers/reviewController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para calificar el servicio y potencialmente banear la contraparte
router.post('/', authenticateJWT, postReview);

export default router;
