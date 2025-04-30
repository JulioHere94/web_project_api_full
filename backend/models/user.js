const mongoose = require("mongoose");
const validator = require("validator");

const urlRegex = /^(https?:\/\/)(www\.)?([\w-]+)(\.[\w-]+)+([/?#].*)?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau", // Valor padrão
    minlength: [2, "O campo 'name' deve ter no mínimo 2 caracteres"],
    maxlength: [30, "O campo 'name' deve ter no máximo 30 caracteres"],
  },
  about: {
    type: String,
    default: "Explorer", // Valor padrão
    minlength: [2, "O campo 'about' deve ter no mínimo 2 caracteres"],
    maxlength: [30, "O campo 'about' deve ter no máximo 30 caracteres"],
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg", // Valor padrão
    validate: {
      validator: (v) => urlRegex.test(v),
      message: "O avatar deve ser uma URL válida",
    },
  },
  email: {
    type: String,
    required: [true, "O campo 'email' é obrigatório"],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "O campo 'email' deve ser um endereço de e-mail válido",
    },
  },
  password: {
    type: String,
    required: [true, "O campo 'password' é obrigatório"],
    minlength: [8, "O campo 'password' deve ter no mínimo 8 caracteres"],
    select: false, // Não retorna o campo por padrão
  },
});

module.exports = mongoose.model("User", userSchema);
