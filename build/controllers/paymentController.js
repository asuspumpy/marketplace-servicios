"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveJobCompletion = exports.acceptFinalQuoteAndPay = exports.sendFinalQuote = void 0;
const uuid_1 = require("uuid");
const paymentModel_1 = require("../models/paymentModel");
const visitModel_1 = require("../models/visitModel");
const serviceRequestModel_1 = require("../models/serviceRequestModel");
const antigravitySkills_1 = require("../services/antigravitySkills");
// 1. El Profesional envía la cotización final después de la Visita Técnica (Problema Complejo)
const sendFinalQuote = async (req, res) => {
    try {
        const { offer_id, request_id, labor_cost, materials_cost } = req.body;
        await (0, paymentModel_1.submitFinalQuote)(offer_id, request_id, labor_cost, materials_cost);
        await (0, serviceRequestModel_1.updateRequestStatus)(request_id, 'quoting_final'); // Nuevo status extendido opcional
        res.status(200).json({ message: 'Presupuesto final enviado al cliente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el presupuesto final' });
    }
};
exports.sendFinalQuote = sendFinalQuote;
// 2. El Cliente aprueba la cotización final -> Retiene el resto del dinero en un nuevo Escrow
const acceptFinalQuoteAndPay = async (req, res) => {
    try {
        const { offer_id, request_id, professional_id, total_amount } = req.body;
        const clientId = req.user.id;
        await (0, paymentModel_1.updateFinalQuoteStatus)(request_id, offer_id, 'accepted');
        // Retener los fondos grandes del trabajo final a través de Mercado Pago
        const escrowResult = await antigravitySkills_1.AntigravitySkills.holdEscrowFunds(clientId, professional_id, total_amount, 'final_job');
        const escrowId = (0, uuid_1.v4)();
        await (0, visitModel_1.createEscrowPayment)(escrowId, request_id, clientId, professional_id, total_amount, 'final_job', escrowResult.mp_preference_id, escrowResult.status);
        await (0, serviceRequestModel_1.updateRequestStatus)(request_id, 'in_progress');
        res.status(200).json({
            message: 'Presupuesto aceptado. Fondos retenidos en Escrow.',
            escrowId,
            mp_details: escrowResult
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el Escrow final' });
    }
};
exports.acceptFinalQuoteAndPay = acceptFinalQuoteAndPay;
// 3. El Cliente marca el trabajo como completado con éxito -> MP Libera la Plata al Profesional
const approveJobCompletion = async (req, res) => {
    try {
        const { request_id, escrow_id } = req.body;
        // Se libera el dinero en nuestra DB (Simulando el API de Mercado Pago)
        await (0, paymentModel_1.releaseEscrowFunds)(escrow_id);
        await (0, serviceRequestModel_1.updateRequestStatus)(request_id, 'completed');
        res.status(200).json({ message: 'Trabajo aprobado por el cliente. Fondos liberados al Profesional exitosamente.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al intentar liberar los fondos en Escrow' });
    }
};
exports.approveJobCompletion = approveJobCompletion;
