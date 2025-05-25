import 'dotenv/config';
import express from 'express';

import tarefaRoutes from './routes/tarefa.routes';
import comentarioRoutes from './routes/comentario.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import { errorHandler } from './middleware/errorhandler';

const app = express();

app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/comentarios', comentarioRoutes);

// Rota health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`🚀 Server em http://localhost:${port}/api`)
);