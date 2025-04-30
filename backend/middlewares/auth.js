const jwt = require("jsonwebtoken");
const { HttpStatus } = require("../enums/http");

const { JWT_SECRET = "default_secret_key" } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .send({ message: "Autorização necessária" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res
      .status(HttpStatus.FORBIDDEN)
      .send({ message: "Token inválido ou expirado" });
  }
};

module.exports = auth;
