import { useState } from "react";
import ButtonLike from "../../images/Vector.svg";
import ButtonLikeActive from "../../images/likeAtive.png"; // Imagem ativa
import ButtonTrash from "../../images/Trash.png";
import { PopupWithConfirmation } from "../Main/components/Popup/PopupWitfhConfirmation";

export default function Card(props) {
  const { card, handleOpenPopup, onCardLike, onCardDelete } = props;
  const { name, link, isLiked } = card;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  function handleLikeClick() {
        onCardLike(card);
  }

  function handleDeleteClick() {
    setIsPopupOpen(true);
  }

  function handleConfirmDelete() {
    onCardDelete(card);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
  }

  return (
    <div className="element">
      <p className="element_paragraph">{name}</p>
      <div className="element__image">
        <img
          className="element_image"
          src={link}
          alt="Descrição da Imagem"
          onClick={handleOpenPopup}
        />
      </div>
      <button className="element__button" onClick={handleLikeClick}>
        <img
          className="element_button-image"
          src={isLiked ? ButtonLikeActive : ButtonLike}
          alt="Curtir"
        />
      </button>
      <button className="element__button-trash" onClick={handleDeleteClick}>
        <img
          className="element_button-image-trash"
          src={ButtonTrash}
          alt="Remover"
        />
      </button>

      {/* Popup de Confirmação */}
      <PopupWithConfirmation
        isOpen={isPopupOpen}
        handleConfirm={handleConfirmDelete}
        onClose={handleClosePopup}
      />
    </div>
  );
}
















