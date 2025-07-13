import 'dotenv/config';
import express from 'express';
import cors from "cors"; 
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import tarefaRoutes from './routes/tarefa.routes';
import comentarioRoutes from './routes/comentario.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import projetoRoutes from './routes/projeto.routes';
import dashboardRoutes from './routes/dashboard.routes';
import cargoRoutes from './routes/cargo.routes';
import tagRoutes from './routes/tag.routes';
import anexoRoutes from './routes/anexo.routes';

import { errorHandler } from './middleware/errorhandler';

const app = express();

const swaggerDocument = YAML.load('swagger.yaml');

app.use(express.json());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://desenrola-app.vercel.app"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);

app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/anexos', anexoRoutes);


app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () =>
    console.log(`🚀 Server em http://localhost:${port}/api`, `📄 Swagger UI em http://localhost:${port}/api-docs`)
  );
}

export default app;