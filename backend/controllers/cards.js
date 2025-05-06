const Card = require("../models/card");
const { HttpStatus } = require("../enums/http");

// Controlador para obter todos os cartões
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(HttpStatus.OK).json(cards);
  } catch (error) {
    next(error);
  }
};

// Controlador para criar um novo cartão
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    res.status(HttpStatus.CREATED).json(newCard);
  } catch (error) {
    next(error);
  }
};

// Controlador para curtir um cartão
const likeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    });

    res.status(HttpStatus.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

// Controlador para descurtir um cartão
const unlikeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    });

    res.status(HttpStatus.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

// Controlador para deletar um cartão
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId).orFail(() => {
      const error = new Error("Cartão não encontrado");
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    });

    if (card.owner.toString() !== req.user._id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Você não tem permissão para excluir este cartão" });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);
    res
      .status(HttpStatus.OK)
      .json({ message: "Cartão deletado com sucesso", card: deletedCard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
};
