import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/Vector-header.png";

function Header({ onLogout, isLoggedIn, email }) {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header__logo" />
      {isLoggedIn ? (
        <div className="header__user-info">
          <p className="header__email">{email}</p>
          <button onClick={onLogout} className="header__logout">
            Sair
          </button>
        </div>
      ) : (
        <nav>
          <Link to="/signin">Entrar</Link>
          <Link to="/signup">Registrar</Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
