import express from 'express';
import usuarioRoutes from './routes/usuario.routes';

const app = express();
app.use(express.json());
app.use('/api', usuarioRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server em http://localhost:${port}/api`));