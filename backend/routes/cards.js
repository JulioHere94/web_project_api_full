const express = require("express");
const Card = require("../models/card");

const router = express.Router();

// Rota para obter todos os cartões
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar cartões", error: error.message });
  }
});

// Rota para criar um novo cartão
router.post("/", async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id; // Supondo que o middleware de autenticação adiciona o objeto user à requisição

    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao criar cartão", error: error.message });
  }
});

// Rota para curtir um cartão
router.put("/:cardId/likes", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Rota para descurtir um cartão
router.delete("/:cardId/likes", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
});

// Rota para deletar um cartão por ID
router.delete("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.json({ message: "Cartão deletado com sucesso", card: deletedCard });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
});

module.exports = router;
