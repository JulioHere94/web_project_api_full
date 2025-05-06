require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { HttpStatus } = require("./enums/http");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards"); // Importe as rotas de cards
const { login, createUser } = require("./controllers/users"); // Importa os controladores
const auth = require("./middlewares/auth");
const cors = require("cors");
const { errors } = require("celebrate");
const logger = require("./utils/logger");
const fs = require("fs");
const https = require("https");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "certs", "privkey.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "certs", "fullchain.pem"),
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

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
    https.createServer(credentials, app).listen(PORT, () => {
      console.log(`🚀 Servidor HTTPS rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  });

// Teste de falha do servidor
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("O servidor travará agora");
  }, 0);
});

// Rotas de autenticação
app.post("/signin", login); // Rota para login
app.post("/signup", createUser); // Rota para registro

// Registre as rotas de usuários
app.use("/users", auth, userRoutes);

// Registre as rotas de cartões
app.use("/cards", auth, cardRoutes); // Certifique-se de usar o middleware de autenticação

// Tratamento de erros
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({ message });
});
