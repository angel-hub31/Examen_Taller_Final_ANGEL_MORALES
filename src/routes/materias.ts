import { Router } from 'express';
import { crearMateria, mostrarMateria,obtenerMateriaPorId,actualizarMateria, eliminarMateria } from '../controllers/materias.controllers.js';

const router = Router();
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Obtiene la lista de todas las materias disponibles
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Lista de materias obtenida con éxito.
 *       500:
 *         description: Error al obtener las materias.
 *   post:
 *     summary: Crea una nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               day:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 example: "08:00:00"
 *               end_time:
 *                 type: string
 *                 example: "10:00:00"
 *               modality:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               credits:
 *                 type: integer
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: integer
     responses:
 *       201:
 *         description: Materia creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error al crear la materia.
 */

router.post('/courses', crearMateria);
router.get('/courses', mostrarMateria);
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Obtiene una materia específica por su ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la materia
 *     responses:
 *       200:
 *         description: Materia encontrada con éxito.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al obtener la materia.
 */
router.get('/courses/:id', obtenerMateriaPorId);
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Actualiza una materia existente por su ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la materia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               day:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 example: "08:00:00"
 *               end_time:
 *                 type: string
 *                 example: "10:00:00"
 *               modality:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               credits:
 *                 type: integer
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al actualizar la materia.
 */
router.put('/courses/:id', actualizarMateria);
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Elimina una materia y sus relaciones de prerrequisitos por su ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único de la materia a eliminar
 *     responses:
 *       200:
 *         description: Materia eliminada correctamente.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al eliminar la materia.
 */
router.delete('/courses/:id', eliminarMateria);

export default router;