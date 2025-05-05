require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { HttpStatus } = require("./enums/http");
const userRoutes = require("./routes/users");
const { login, createUser } = require("./controllers/users"); // Importa os controladores
const auth = require("./middlewares/auth");
const cors = require("cors");
const { errors } = require("celebrate");
const logger = require("./utils/logger");

const app = express();
app.use(cors()); // Permite requisições de origens diferentes
app.use(express.json()); // Middleware para interpretar JSON

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aroundb"; // 127.0.0.1 para evitar erro com "::1"

// Conecta ao MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conexão com o MongoDB estabelecida com sucesso");

    // Inicia o servidor Express após a conexão com o MongoDB
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  });

// Rotas de autenticação
app.post("/signin", login); // Rota para login
app.post("/signup", createUser); // Rota para registro

// Registre as rotas de usuários
app.use("/users", auth, userRoutes);

// Importa os módulos de rotas
const cardsRoute = require("./routes/cards");

// Define as rotas base para cada módulo
app.use("/cards", auth, cardsRoute);

// Middleware para lidar com rotas inexistentes
app.use((req, res) => {
  res.status(404).send({ message: "Resource not found" });
});

// Middleware para lidar com erros de validação
app.use(errors());

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  logger.error({
    message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).send({
    message: statusCode === 500 ? "Erro interno no servidor" : message,
  });
});

module.exports = app;
