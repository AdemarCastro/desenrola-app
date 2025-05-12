import express from 'express';
import tarefaRoutes from './routes/tarefa.routes';
import comentarioRoutes from './routes/comentario.routes';

const app = express();
app.use(express.json());

app.use('/api/tarefas', tarefaRoutes);
app.use('/comentarios', comentarioRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server em http://localhost:${port}/api`));