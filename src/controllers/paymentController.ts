import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { submitFinalQuote, updateFinalQuoteStatus, releaseEscrowFunds } from '../models/paymentModel';
import { createEscrowPayment } from '../models/visitModel';
import { updateRequestStatus } from '../models/serviceRequestModel';
import { AntigravitySkills } from '../services/antigravitySkills';

// 1. El Profesional envía la cotización final después de la Visita Técnica (Problema Complejo)
export const sendFinalQuote = async (req: AuthRequest, res: Response) => {
    try {
        const { offer_id, request_id, labor_cost, materials_cost } = req.body;

        await submitFinalQuote(offer_id, request_id, labor_cost, materials_cost);
        await updateRequestStatus(request_id, 'quoting_final'); // Nuevo status extendido opcional

        res.status(200).json({ message: 'Presupuesto final enviado al cliente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el presupuesto final' });
    }
};

// 2. El Cliente aprueba la cotización final -> Retiene el resto del dinero en un nuevo Escrow
export const acceptFinalQuoteAndPay = async (req: AuthRequest, res: Response) => {
    try {
        const { offer_id, request_id, professional_id, total_amount } = req.body;
        const clientId = req.user!.id;

        await updateFinalQuoteStatus(request_id, offer_id, 'accepted');

        // Retener los fondos grandes del trabajo final a través de Mercado Pago
        const escrowResult = await AntigravitySkills.holdEscrowFunds(clientId, professional_id, total_amount, 'final_job');

        const escrowId = uuidv4();
        await createEscrowPayment(
            escrowId, request_id, clientId, professional_id, total_amount,
            'final_job', escrowResult.mp_preference_id, escrowResult.status
        );

        await updateRequestStatus(request_id, 'in_progress');

        res.status(200).json({
            message: 'Presupuesto aceptado. Fondos retenidos en Escrow.',
            escrowId,
            mp_details: escrowResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el Escrow final' });
    }
};

// 3. El Cliente marca el trabajo como completado con éxito -> MP Libera la Plata al Profesional
export const approveJobCompletion = async (req: AuthRequest, res: Response) => {
    try {
        const { request_id, escrow_id } = req.body;

        // Se libera el dinero en nuestra DB (Simulando el API de Mercado Pago)
        await releaseEscrowFunds(escrow_id);

        await updateRequestStatus(request_id, 'completed');

        res.status(200).json({ message: 'Trabajo aprobado por el cliente. Fondos liberados al Profesional exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al intentar liberar los fondos en Escrow' });
    }
};
