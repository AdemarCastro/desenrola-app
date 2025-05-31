import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import tarefaRoutes from './routes/tarefa.routes';
import comentarioRoutes from './routes/comentario.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import projetoRoutes from './routes/projeto.routes';
import { errorHandler } from './middleware/errorhandler';

const app = express();

// 1) Carrega seu spec (ajuste o caminho se necessário)
const swaggerDocument = YAML.load('swagger.yaml');

app.use(express.json());

// 2) Monta o Swagger UI em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/comentarios', comentarioRoutes);

// Rota health check
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