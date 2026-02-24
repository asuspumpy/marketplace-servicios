"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLogToBitacora = void 0;
const uuid_1 = require("uuid");
const serviceLogModel_1 = require("../models/serviceLogModel");
const addLogToBitacora = async (req, res) => {
    try {
        const { request_id, action_type, description, media_urls } = req.body;
        const professionalId = req.user.id;
        const logId = (0, uuid_1.v4)();
        // Validamos que el actionType sea correcto de acuerdo a la Trazabilidad definida
        const allowedActions = ['arrival', 'diagnosis', 'quote_submitted', 'work_started', 'milestone_reached', 'work_finished'];
        if (!allowedActions.includes(action_type)) {
            return res.status(400).json({ message: 'Tipo de acción no permitida en la bitácora.' });
        }
        await (0, serviceLogModel_1.createServiceLog)(logId, request_id, professionalId, action_type, description, media_urls || []);
        res.status(201).json({
            message: 'Registro añadido a la bitácora de servicio',
            logId
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar avance en la bitácora' });
    }
};
exports.addLogToBitacora = addLogToBitacora;
