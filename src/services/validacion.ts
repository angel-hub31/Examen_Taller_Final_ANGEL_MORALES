// src/services/validacion.ts

import { config } from "process";

// Interfaz basada en tu modelo de Prisma
interface Course {
    id: number;
    name: string;
    day: string;
    start_time: Date;
    end_time: Date;
    modality: string;
    difficulty: string;
    credits: number;
    prerequisites?: { prerequisite_course_id: number }[];
}

// Paso 6: Representar horario como conjunto (Sección 28)
export function getCourseNameSet(schedule: Course[]): Set<string> {
    return new Set(schedule.map(course => course.name));
}

// Paso 7: Validar materias obligatorias usando Subconjuntos (Sección 29)
export function includesRequiredCourses(scheduleSet: Set<string>, requiredCoursesSet: Set<string>): boolean {
    return [...requiredCoursesSet].every(course => scheduleSet.has(course));
}

// Paso 8: Detectar cruces de horario (Sección 30)
export function haveTimeConflict(courseA: Course, courseB: Course): boolean {
    if (courseA.day !== courseB.day) {
        return false;
    }
    // Convertimos las fechas a un valor numérico para comparar las horas
    const aStartMinutes = courseA.start_time.getUTCHours() * 60 + courseA.start_time.getUTCMinutes();
    const aEndMinutes = courseA.end_time.getUTCHours() * 60 + courseA.end_time.getUTCMinutes();
    const bStartMinutes = courseB.start_time.getUTCHours() * 60 + courseB.start_time.getUTCMinutes();
    const bEndMinutes = courseB.end_time.getUTCHours() * 60 + courseB.end_time.getUTCMinutes();

    return (aStartMinutes < bEndMinutes && bStartMinutes < aEndMinutes);
}

export function hasScheduleConflicts(courses: Course[]): boolean {
    for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
            if (haveTimeConflict(courses[i]!, courses[j]!)) {
                return true;
            }
        }
    }
    return false;
}

// Paso 12: Validar prerrequisitos (Sección 34)
export function meetsPrerequisites(schedule: Course[], completedCourses: string[], allCoursesData: Course[]): boolean {
    // Obtenemos los IDs de los cursos completados basándonos en sus nombres
    const completedCourseIds = completedCourses.map(name => {
        const c = allCoursesData.find(course => course.name.trim().toLowerCase() === name.trim().toLowerCase());
        return c ? c.id : -1;
    }).filter(id => id !== -1);

    const availableCourses = new Set([
        ...schedule.map(course => course.id),
        ...completedCourseIds
    ]);

    return schedule.every(course => {
        if (!course.prerequisites || course.prerequisites.length === 0) return true;

        return course.prerequisites.every(prereq =>
            availableCourses.has(prereq.prerequisite_course_id)
        );
    });
}

// Paso 14: Evaluar horario y generar explicaciones de descarte (Sección 36)
export function evaluateSchedule(schedule: Course[], configuration: any, allCoursesData: Course[]) {
    const reasons: string[] = [];

    //
    if (configuration.numberOfCourses < 1 || configuration.numberOfCourses > 10) {
        reasons.push("El número de materias debe estar entre 1 y 10.");
    }

    if (configuration.maximumCredits < 0 || configuration.maximumCredits > 10) {
        reasons.push("El límite máximo de créditos de estar entre 0 y 10 creditos.");
    }
    
    if (configuration.maximumDifficultCourses < 0 || configuration.maximumDifficultCourses>5) {
        reasons.push("El máximo de materias difíciles debe estar entre 0 y 5.");
    }

    const courseSet = getCourseNameSet(schedule);
    if (!includesRequiredCourses(courseSet, new Set(configuration.requiredCourses || []))) {
        reasons.push("No contiene todas las materias obligatorias.");
    }

    // Validar cantidad de materias
    if (schedule.length !== configuration.numberOfCourses) {
        reasons.push("La cantidad de materias no coincide con la configuración solicitada.");
    }
    // Validar cruces
    if (configuration.avoidTimeConflicts && hasScheduleConflicts(schedule)) {
        reasons.push("El horario tiene cruces.");
    }

    // Validar Modalidad (Paso 9 - Sección 31)
    if (configuration.requiredModality && configuration.requiredModality !== 'Cualquiera') {
        const meetsModality = schedule.some(course => course.modality === configuration.requiredModality);
        if (!meetsModality) {
            reasons.push(`No contiene al menos una materia en modalidad ${configuration.requiredModality}.`);
        }
    }

    // Validar Dificultad (Paso 10 - Sección 32)
    const difficultCourses = schedule.filter(course => course.difficulty === "Alta");
    if (configuration.maximumDifficultCourses !== undefined && difficultCourses.length > configuration.maximumDifficultCourses) {
        reasons.push("Supera el máximo de materias difíciles.");
    }

    // Validar Créditos (Paso 11 - Sección 33)
    const totalCredits = schedule.reduce((total, course) => total + course.credits, 0);
    if (configuration.maximumCredits !== undefined && totalCredits > configuration.maximumCredits) {
        reasons.push("Supera el máximo de créditos.");
    }

    // Validar Prerrequisitos
    if (configuration.validatePrerequisites && !meetsPrerequisites(schedule, configuration.completedCourses || [], allCoursesData)) {
        reasons.push("No cumple los prerrequisitos.");
    }

    return {
        valid: reasons.length === 0,
        reasons
    };
}