const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpStatus } = require("../enums/http");

const { JWT_SECRET = "default_secret_key" } = process.env; // Use uma chave secreta do .env

// Controlador de login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email }).orFail(() => {
      const error = new Error("Credenciais inválidas");
      error.statusCode = HttpStatus.UNAUTHORIZED;
      throw error;
    });

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: "Credenciais inválidas" });
    }

    // Cria o token JWT
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Envia o token no corpo da resposta
    res.status(HttpStatus.OK).send({ token });
  } catch (error) {
    const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(statusCode).send({ message: error.message });
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
      name,
      about,
      avatar,
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

module.exports = {
  login,
  createUser,
};
