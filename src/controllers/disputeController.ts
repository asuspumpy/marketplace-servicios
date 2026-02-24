import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { createDispute, updateEscrowStatus } from '../models/disputeModel';

export const openDispute = async (req: AuthRequest, res: Response) => {
    try {
        const { request_id, escrow_id, reason_category, description } = req.body;
        const initiatorId = req.user!.id;
        const disputeId = uuidv4();

        // Creamos la disputa formal
        await createDispute(disputeId, request_id, escrow_id, initiatorId, reason_category, description);

        // Bloqueamos/Modificamos el estado del Pago en Escrow preventivamente
        await updateEscrowStatus(escrow_id, 'disputed');

        // Notificación de que el equipo de Arbitraje revisará el caso usando la Bitácora como prueba.
        res.status(201).json({
            message: 'Disputa abierta correctamente. Los fondos en Escrow han sido congelados hasta resolución.',
            disputeId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al intentar abrir la disputa' });
    }
};
