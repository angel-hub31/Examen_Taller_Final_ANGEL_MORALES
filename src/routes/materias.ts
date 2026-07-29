import { Router } from 'express';
import { crearMateria, mostrarMateria,obtenerMateriaPorId,actualizarMateria, eliminarMateria } from '../controllers/materias.controllers.js';

const router = Router();

router.post('/courses', crearMateria);
router.get('/courses', mostrarMateria);
router.get('/courses/:id', obtenerMateriaPorId);
router.put('/courses/:id', actualizarMateria);
router.delete('/courses/:id', eliminarMateria);

export default router;