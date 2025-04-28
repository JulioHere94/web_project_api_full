const jwt = require("jsonwebtoken");
const { HttpStatus } = require("../enums/http");

const { JWT_SECRET = "default_secret_key" } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Verifica se o cabeçalho de autorização está presente e começa com "Bearer"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ message: "Autorização necessária" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    // Verifica e decodifica o token
    const payload = jwt.verify(token, JWT_SECRET);

    // Adiciona o payload ao objeto `req.user`
    req.user = payload;

    // Chama o próximo middleware
    next();
  } catch (err) {
    // Retorna erro 401 se o token for inválido ou expirado
    res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ message: "Token inválido ou expirado" });
  }
};

module.exports = auth;