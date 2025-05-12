import express from 'express';
import tarefaRoutes from './routes/tarefa.routes';

const app = express();
app.use(express.json());

app.use('/api/tarefas', tarefaRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server em http://localhost:${port}/api`));