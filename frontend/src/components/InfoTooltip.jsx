import React from "react";
import erroIcon from "../images/error-icon.png";
import sucessIcon from "../images/success-icon.png";
import closeIcon from "../images/Close Icon.png";

function InfoTooltip({ isOpen, onClose, message, isSuccess }) {
  return (
    <dialog open={isOpen}>
      <div className="info-tooltip">
      <button onClick={onClose} className="info-tooltip__close-button">
        <img src={closeIcon} alt="Close" className="info-tooltip__close-icon" />
      </button>
      <div className="info-tooltip__content">
        <img
          src={isSuccess ? sucessIcon : erroIcon}
          alt="Status"
          className="info-tooltip__icon"
        />
        <p className={`info-tooltip__message ${isSuccess ? "success" : "error"}`}>
          {message}
        </p>
      </div>
      </div>
    </dialog>
  );
}

export default InfoTooltip;