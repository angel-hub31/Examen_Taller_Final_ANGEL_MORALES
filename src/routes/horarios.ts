import { Router } from 'express';
import { generarHorarios } from '../controllers/horarios.controllers.js';

const router = Router();

// Endpoint principal detallado en el Paso 16 del documento
router.post('/schedules/generate', generarHorarios);

export default router;