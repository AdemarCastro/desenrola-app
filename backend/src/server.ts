import express from 'express';

const app = express();
app.use(express.json());
app.use('/api', (req, res) => {
  res.json({ message: 'Hello World!' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server em http://localhost:${port}/api`));