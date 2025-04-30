import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/Vector-header.png";
import InfoTooltip from "../InfoTooltip";
import { register } from "../../utils/auth";
import "../../blocks/Sign.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password); // Chama a função de registro
      setTooltipMessage("Vitória! Você precisa se registrar.");
      setIsSuccess(true);
      setIsTooltipOpen(true);
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setTooltipMessage("Ops, algo deu errado! Por favor, tente novamente.");
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
        <p className="header__link">Faça o login</p>
      </header>
      <form onSubmit={handleSubmit} className="form_sign">
        <h1 className="form__title">Inscrever-se</h1>
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
        <button type="submit">Inscrever-se</button>
        <p className="form__text">
          Já é membro? Faça o login{" "}
          <Link to="/signin" className="form__link">
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

export default Register;
