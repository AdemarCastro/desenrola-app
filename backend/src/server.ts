import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server em http://localhost:${port}/api`));