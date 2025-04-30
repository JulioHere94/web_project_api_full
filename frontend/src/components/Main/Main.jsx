import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import pen from "../../images/pen.png";
import edit from "../../images/button-edit.png";
import add from "../../images/Vector_button_big.png";
import Popup from "./components/Popup/Popup";
import NewCard from "./components/NewCard/NewCard";
import EditProfile from "./components/EditProfile/EditProfile";
import EditAvatar from "./components/EditAvatar/EditAvatar";
import Card from "../Card/Card";
import ImagePopup from "../ImagePopup/ImagePopup"; 

function Main({ cards, onCardLike, onCardDelete, onAddCard, onOpenPopup, onClosePopup, popup }) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = { title: "", children: <NewCard onAddCard={onAddCard} /> };
  const editProfilePopup = { title: "", children: <EditProfile /> };
  const editAvatarPopup = { title: "", children: <EditAvatar /> };

  function handleCardClick(card) {
    onOpenPopup({
      title: card.name,
      children: <ImagePopup card={card} />
    });
  }

  return (
    <main className="main">
      {/* Seção do perfil */}
      <section className="profile">
        <div className="profile-container">
          <img 
            src={currentUser?.avatar || "https://practicum-content.s3.us-west-1.amazonaws.com/frontend-developer/common/avatar.jpg"} 
            alt="imagem de perfil" 
            className="Profile__image"
          />
          <img
            className="profile-icon"
            src={pen}
            alt="Editar avatar"
            onClick={() => onOpenPopup(editAvatarPopup)}
          />
        </div>
        <ul className="profile-Info">
          <li className="profile-Info_name name-result">
            {currentUser?.name || "Carregando..."}
          </li>
          <li className="profile-Info_sub-title sub-title">
            {currentUser?.about || "Carregando..."}
          </li>
          <button
            className="profile-Info__button"
            id="edit"
            onClick={() => onOpenPopup(editProfilePopup)}
          >
            <img
              src={edit}
              alt="botão editar"
              className="profile-Info__button-image"
            />
          </button>
        </ul>
        <button
          type="button"
          className="profile__Button-Add"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          <img
            src={add}
            alt="Botão adicionar"
            className="Profile__Button-Add-image"
          />
        </button>
      </section>

      {/* Lista de cartões */}
      <ul className="elements__container">
        {cards.map((card) => (
          <Card 
            key={card._id} 
            card={card} 
            isLiked={(card.likes || []).includes(currentUser?._id)}
            handleOpenPopup={() => handleCardClick(card)}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>

      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
























