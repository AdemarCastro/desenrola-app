import express from "express";
import cors from "cors"; 

import tarefaRoutes from "./routes/tarefa.routes";
import comentarioRoutes from "./routes/comentario.routes";
import usuarioRoutes from "./routes/usuario.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // provavelmente trocar futuramente 
    credentials: true, // se precisar usar cookies/sessões no futuro
  })
);

app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tarefas", tarefaRoutes);
app.use("/comentarios", comentarioRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀 Server em http://localhost:${port}/api`)
);
