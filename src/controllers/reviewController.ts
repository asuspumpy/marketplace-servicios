import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { createReview, markUserAsRisk, checkRiskFlagsCount } from '../models/reviewModel';

export const postReview = async (req: AuthRequest, res: Response) => {
    try {
        const { request_id, reviewee_id, rating, comment, is_risk_flag } = req.body;
        const reviewerId = req.user!.id;
        const reviewId = uuidv4();

        // Si rating es muy bajo, internamente consideramos reportarlo como Risk
        const calculatedRiskFlag = (rating <= 2 && is_risk_flag) ? true : false;

        await createReview(reviewId, request_id, reviewerId, reviewee_id, rating, comment, calculatedRiskFlag);

        // ALGORITMO ANTIBLOQUEO: Cliente o Profesional de Riesgo
        // Si un usuario acumula 3 banderas de riesgo (ej: Cliente conflictivo, o Pro negligente)
        // El sistema automáticamente lo marca como "is_risk_user = true" previniendo matchings.
        if (calculatedRiskFlag) {
            const riskCount = await checkRiskFlagsCount(reviewee_id);
            if (riskCount >= 3) {
                await markUserAsRisk(reviewee_id);
                console.warn(`[ALERTA AUTOMÁTICA] El usuario ${reviewee_id} ha sido baneado preventivamente (Cliente/Pro de Riesgo)`);
            }
        }

        res.status(201).json({
            message: 'Reseña enviada exitosamente',
            riskEvaluated: calculatedRiskFlag
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando la calificación' });
    }
};
