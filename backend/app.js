require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { HttpStatus } = require("./enums/http");
const userRoutes = require("./routes/users");
const { login, createUser } = require("./controllers/users"); // Importa os controladores
const auth = require("./middlewares/auth");

const app = express();
app.use(express.json()); // Middleware para interpretar JSON

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

// Middleware temporário para adicionar um usuário fixo (remova isso após implementar o auth)
app.use((req, res, next) => {
  req.user = {
    _id: "67dc9bdf23242fe8a46034b9", // ID fixo temporário
  };
  next();
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

module.exports = app;
