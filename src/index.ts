import express from 'express';
import cors from 'cors';
import materiasRouter from "./routes/materias.js"
import horariosRouter from "./routes/horarios.js"
import { setupSwagger } from './config/swagger-jsdoc.js'; 

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Importante para poder recibir JSON en el body

app.get("/", (req, res) => {
    res.json({ mensaje: "API funcionando correctamente" });
});

// Usar las rutas del CRUD
app.use('/', materiasRouter);
app.use('/', horariosRouter);

// Inicializar la documentación de Swagger
setupSwagger(app); // 


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});