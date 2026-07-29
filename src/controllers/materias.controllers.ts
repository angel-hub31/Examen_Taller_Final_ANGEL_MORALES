import { type Request, type Response } from 'express';
import prisma from '../database/prisma.js';

// Crear una materia (POST /courses)
export const crearMateria = async (req: Request, res: Response) => {
    try {
        const { name, day, start_time, end_time, modality, difficulty, credits, prerequisites } = req.body;
        
        // Prisma espera formato DateTime para los campos de tipo Time, agregamos una fecha base
        const baseDate = "1970-01-01T";

        const newCourse = await prisma.courses.create({
            data: {
                name,
                day,
                start_time: new Date(`${baseDate}${start_time}Z`),
                end_time: new Date(`${baseDate}${end_time}Z`),
                modality,
                difficulty,
                credits
            }
        });

        // Si envían prerrequisitos, los registramos en la tabla intermedia
        if (prerequisites && prerequisites.length > 0) {
            const prereqData = prerequisites.map((reqId: number) => ({
                course_id: newCourse.id,
                prerequisite_course_id: reqId
            }));
            
            await prisma.prerequisites.createMany({
                data: prereqData
            });
        }

        res.status(201).json(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la materia' });
    }
};

// Obtener todas las materias (GET /courses) - Este será tu Conjunto Universal
export const mostrarMateria = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                prerequisites: true
            }
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las materias' });
    }
};

// NUEVO: Obtener una materia específica por ID (GET /courses/:id)
export const obtenerMateriaPorId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id as string, 10);

        const course = await prisma.courses.findUnique({
            where: { id: numericId },
            include: {
                prerequisites: true // Incluimos sus prerrequisitos
            }
        });

        if (!course) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la materia' });
    }
};

// Actualizar materia (PUT /courses/:id)
export const actualizarMateria = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id as string, 10);
        
        const { name, day, start_time, end_time, modality, difficulty, credits, prerequisites } = req.body;
        
        const baseDate = "1970-01-01T";

        // 1. Actualizamos los datos principales de la materia
        const updatedCourse = await prisma.courses.update({
            where: { id: numericId },
            data: {
                name,
                day,
                // Validamos si envían la hora para formatearla, si no, se queda igual
                ...(start_time && { start_time: new Date(`${baseDate}${start_time}Z`) }),
                ...(end_time && { end_time: new Date(`${baseDate}${end_time}Z`) }),
                modality,
                difficulty,
                credits
            }
        });

        // 2. Si se envían prerrequisitos en la petición, los actualizamos
        if (prerequisites !== undefined) {
            // Primero eliminamos los prerrequisitos actuales de esta materia
            await prisma.prerequisites.deleteMany({
                where: { course_id: numericId }
            });

            // Si el arreglo tiene elementos, creamos las nuevas relaciones
            if (prerequisites.length > 0) {
                const prereqData = prerequisites.map((reqId: number) => ({
                    course_id: numericId,
                    prerequisite_course_id: reqId
                }));
                
                await prisma.prerequisites.createMany({
                    data: prereqData
                });
            }
        }

        res.json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la materia' });
    }
};


// Eliminar materia (DELETE /courses/:id)
export const eliminarMateria = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        
        // Le aseguramos a TypeScript que id es un string y lo convertimos a número
        const numericId = parseInt(id as string, 10);

        // Primero eliminamos las relaciones de prerrequisitos
        await prisma.prerequisites.deleteMany({
            where: {
                OR: [
                    { course_id: numericId },
                    { prerequisite_course_id: numericId }
                ]
            }
        });

        // Luego eliminamos la materia principal
        await prisma.courses.delete({
            where: { id: numericId }
        });

        res.json({ message: 'Materia eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la materia' });
    }
};