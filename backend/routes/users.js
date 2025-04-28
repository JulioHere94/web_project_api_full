const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { login } = require("../controllers/users");

const router = express.Router();

// Rota GET /users - Retorna todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários", error: error.message });
  }
});

// Rota GET /users/:userId - Retorna um usuário específico
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar o usuário", error: error.message });
  }
});

// Rota PATCH /users/me - Atualiza o perfil do usuário
router.patch("/me", async (req, res) => {
  try {
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    const statusCode =
      error.name === "ValidationError" ? 400 : error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Rota PATCH /users/me/avatar - Atualiza o avatar do usuário
router.patch("/me/avatar", async (req, res) => {
  try {
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    const statusCode =
      error.name === "ValidationError" ? 400 : error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Rota de login
router.post("/login", login);

module.exports = router;
