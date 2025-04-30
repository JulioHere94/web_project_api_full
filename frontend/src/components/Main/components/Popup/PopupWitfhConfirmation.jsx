import React, { useEffect, useRef } from "react";
import close from "../../../../images/Close Icon.png";

export const PopupWithConfirmation = ({ handleConfirm, isOpen, onClose }) => {
  const dialogRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  const handleConfirmClick = (event) => {
    event.preventDefault();
    handleConfirm();
    handleClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && isOpen && !dialog.open) //também refiz a logica com a abordagem sugerida
      {
      dialog.showModal();
    } else if (dialog && !isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog className="popup popup-delete" id="popup-delete" ref={dialogRef}>
      <div className="popup_rectangle">
        <button className="popup__button-cancel" onClick={handleClose}>
          <img
            src={close}
            className="popup__button-cancel-image"
            alt="Fechar"
          />
        </button>
        <form
          className="popup__container form form__delete"
          onSubmit={handleConfirmClick}
        >
          <h1 className="container__title title__delete">Tem certeza?</h1>
          <button type="submit" className="container__button button__delete">
            Sim
          </button>
        </form>
      </div>
    </dialog>
  );
};
