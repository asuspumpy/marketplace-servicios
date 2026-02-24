"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitRequest = void 0;
const uuid_1 = require("uuid");
const serviceRequestModel_1 = require("../models/serviceRequestModel");
const antigravitySkills_1 = require("../services/antigravitySkills");
const submitRequest = async (req, res) => {
    try {
        const { property_id, title, description, preferred_gender } = req.body;
        const clientId = req.user.id;
        const requestId = (0, uuid_1.v4)();
        // Creamos la solicitud de servicio con complejidad pendiente
        await (0, serviceRequestModel_1.createServiceRequest)({
            id: requestId,
            client_id: clientId,
            property_id,
            title,
            description,
            complexity: 'pending_triage',
            preferred_gender: preferred_gender || 'any'
        });
        // 1. Skill: Clasificación Automática de Problemas (Triaje)
        // La AI decide de forma asíncrona si es simple o requiere visita compleja.
        const triageResult = await antigravitySkills_1.AntigravitySkills.triageProblem(description);
        await (0, serviceRequestModel_1.updateRequestComplexity)(requestId, triageResult.complexity);
        res.status(201).json({
            message: 'Solicitud creada y clasificada exitosamente',
            requestId,
            triage_assigned: triageResult.complexity
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud de servicio' });
    }
};
exports.submitRequest = submitRequest;
