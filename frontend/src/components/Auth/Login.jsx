import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import InfoTooltip from "../InfoTooltip";
import logo from "../../images/Vector-header.png";
import "../../blocks/Sign.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token); // Salva o token retornado pela API
      setTooltipMessage("Login bem-sucedido!");
      setIsSuccess(true);
      setIsTooltipOpen(true);
      setTimeout(() => {
        setIsTooltipOpen(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      setTooltipMessage(
        "Ops, algo saiu deu errado! Por favor, tente novamente."
      );
      setIsSuccess(false);
      setIsTooltipOpen(true);
    }
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  return (
    <div className="container">
      <header className="header_login">
        <img src={logo} alt="Logo" className="header__logo" />
        <p className="header__link">Entrar</p>
      </header>
      <form onSubmit={handleSubmit} className="form_sign">
        <h1 className="form__title">Entrar</h1>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        <p className="form__text">
          Ainda não é membro? Inscreva-se{" "}
          <Link to="/signup" className="form__link">
            aqui!
          </Link>
        </p>
      </form>
      <InfoTooltip
        isOpen={isTooltipOpen}
        onClose={closeTooltip}
        message={tooltipMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
}

export default Login;
