import { Router } from 'express';
import { generarHorarios } from '../controllers/horarios.controllers.js';

const router = Router();

/**
 * @swagger
 * /schedules/generate:
 *   post:
 *     summary: Genera combinaciones de horarios válidos según la configuración
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberOfCourses:
 *                 type: integer
 *                 example: 3
 *               requiredCourses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Matemáticas"]
 *               maximumCredits:
 *                 type: integer
 *                 example: 12
 *               maximumDifficultCourses:
 *                 type: integer
 *                 example: 2
 *               avoidTimeConflicts:
 *                 type: boolean
 *                 example: true
 *               validatePrerequisites:
 *                 type: boolean
 *                 example: true
 *               completedCourses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               requiredModality:
 *                 type: string
 *                 example: "Cualquiera"
 *     responses:
 *       200:
 *         description: Horarios procesados exitosamente.
 *       400:
 *         description: Error de validación o insuficientes materias.
 *       500:
 *         description: Error interno del servidor.
 */

// Endpoint principal detallado en el Paso 16 del documento
router.post('/schedules/generate', generarHorarios);

export default router;