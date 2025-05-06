const express = require("express");
const {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
} = require("../controllers/cards");
const { validateCardCreation } = require("../utils/validators");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getCards); // Obter todos os cartões
router.post("/", auth, validateCardCreation, createCard); // Criar um novo cartão
router.put("/:cardId/likes", auth, likeCard); // Curtir um cartão
router.delete("/:cardId/likes", auth, unlikeCard); // Descurtir um cartão
router.delete("/:cardId", auth, deleteCard); // Deletar um cartão

module.exports = router;
