require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const { HttpStatus } = require("./enums/http");
const userRoutes = require("./routes/users");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const cors = require("cors");
const { errors } = require("celebrate");
const logger = require("./utils/logger");

const app = express();
app.use(cors());
app.use(express.json());

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
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aroundb";

// Conecta ao MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conexão com o MongoDB estabelecida com sucesso");

    // Carregar os certificados SSL
    const privateKey = fs.readFileSync("path/to/privkey.pem", "utf8");
    const certificate = fs.readFileSync("path/to/cert.pem", "utf8");
    const ca = fs.readFileSync("path/to/chain.pem", "utf8");

    const credentials = { key: privateKey, cert: certificate, ca };

    // Inicia o servidor HTTPS
    https.createServer(credentials, app).listen(PORT, () => {
      console.log(`🚀 Servidor HTTPS rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  });

// Rotas de autenticação
app.post("/signin", login);
app.post("/signup", createUser);

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
