const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpStatus } = require("../enums/http");

const { JWT_SECRET = "default_secret_key" } = process.env; // Use uma chave secreta do .env

// Controlador de login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password").orFail();
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Retorna os dados do usuário junto com o token
    res.status(HttpStatus.OK).send({
      token,
      user: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Envia o erro para o middleware de tratamento de erros
  }
};

// Controlador de criação de usuário
const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Codifica a senha em hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário com os valores fornecidos ou valores padrão
    const user = await User.create({
      name: name || undefined, // Permite que o Mongoose aplique o valor padrão
      about: about || undefined,
      avatar: avatar || undefined,
      email,
      password: hashedPassword,
    });

    res.status(HttpStatus.CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "O email já está em uso" });
    }
    res.status(HttpStatus.BAD_REQUEST).send({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      const error = new Error("Usuário não encontrado");
      error.statusCode = HttpStatus.NOT_FOUND;
      throw error;
    });

    res.status(HttpStatus.OK).send(user);
  } catch (error) {
    const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(statusCode).send({ message: error.message });
  }
};

module.exports = {
  login,
  createUser,
  getCurrentUser, // Exporta o novo controlador
};
