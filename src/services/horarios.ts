// src/services/horarios.ts
import prisma from '../database/prisma.js';
import { calculateCombinationCount, generateCombinations } from './combinatoria.js';
import { evaluateSchedule } from './validacion.js';

export const procesarGeneracionHorarios = async (configuration: any) => {
    // 1. Obtener el conjunto universal desde la BD (Paso 2)
    const courses = await prisma.courses.findMany({
        include: {
            prerequisites: true
        }
    });

    // 2. Validación de cantidad (Paso 3)
    if (configuration.numberOfCourses > courses.length) {
        throw new Error('INSUFFICIENT_COURSES');
    }

    // 3. Calcular número de combinaciones teóricas C(n,r) (Paso 4)
    const totalCombinations = calculateCombinationCount(courses.length, configuration.numberOfCourses);

    // 4. Generar todas las combinaciones posibles (Paso 5)
    const possibleSchedules = generateCombinations(courses, configuration.numberOfCourses);

    // 5. Evaluar cada horario y aplicar reglas lógicas (Paso 13 y 14)
    const evaluatedSchedules = possibleSchedules.map(schedule => ({
        courses: schedule,
        evaluation: evaluateSchedule(schedule, configuration, courses)
    }));

    // 6. Separar horarios válidos y descartados (Paso 15 - Sección 37)
    const validSchedules = evaluatedSchedules.filter(item => item.evaluation.valid);
    const discardedSchedules = evaluatedSchedules.filter(item => !item.evaluation.valid);

    // 7. Formatear la respuesta exacta que pide el documento (Paso 16 - Sección 38)
    return {
        totalCourses: courses.length,
        selectedAmount: configuration.numberOfCourses,
        totalCombinations,
        validSchedules: validSchedules.length,
        discardedSchedules: discardedSchedules.length,
        schedules: evaluatedSchedules.map(item => ({
            courses: item.courses.map(c => c.name), // Enviamos solo los nombres en el arreglo principal
            totalCredits: item.courses.reduce((total, c) => total + c.credits, 0),
            valid: item.evaluation.valid,
            reasons: item.evaluation.reasons,
            // (Opcional extra) Enviamos el detalle completo para usarlo en tu Frontend (Pantalla 4)
            courseDetails: item.courses 
        }))
    };
};