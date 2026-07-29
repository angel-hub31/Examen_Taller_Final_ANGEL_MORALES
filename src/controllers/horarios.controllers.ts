// src/controllers/horarios.controllers.ts
import { type Request,type Response } from 'express';
// Importaremos la función principal desde nuestro servicio (que crearemos a continuación)
import { procesarGeneracionHorarios } from '../services/horarios.js';

export const generarHorarios = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1. Extraemos la configuración enviada desde el frontend en el cuerpo de la petición
        const {
            numberOfCourses,
            requiredCourses = [],
            maximumCredits = 999, // Si no envían límite, ponemos uno muy alto
            maximumDifficultCourses = 999,
            avoidTimeConflicts = true,
            validatePrerequisites = true,
            completedCourses = [],
            requiredModality = 'Cualquiera'
        } = req.body;

        // 2. Validación básica de los datos de entrada
        if (!numberOfCourses || numberOfCourses <= 0) {
            return res.status(400).json({ 
                error: "Debe especificar un número válido de materias (numberOfCourses)." 
            });
        }

        // Agrupamos la configuración en un solo objeto para pasarlo al servicio
        const configuration = {
            numberOfCourses,
            requiredCourses,
            maximumCredits,
            maximumDifficultCourses,
            avoidTimeConflicts,
            validatePrerequisites,
            completedCourses,
            requiredModality
        };

        // 3. Llamamos al servicio que ejecuta toda la lógica matemática y de validación
        const result = await procesarGeneracionHorarios(configuration);

        // 4. Respondemos con el JSON en el formato exacto solicitado en el Paso 16
        return res.status(200).json(result);

    } catch (error: any) {
        console.error("Error al generar horarios:", error);
        
        // Manejamos la validación del Paso 3 del documento: si piden más materias de las disponibles
        if (error.message === 'INSUFFICIENT_COURSES') {
            return res.status(400).json({ 
                error: "No existen suficientes materias disponibles para cumplir la configuración solicitada." 
            });
        }

        return res.status(500).json({ error: "Ocurrió un error interno al generar los horarios." });
    }
};