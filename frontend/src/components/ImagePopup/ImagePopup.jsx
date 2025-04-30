export default function ImagePopup({ card }) {
  const { name, link } = card;
  return (
    <div className="popup__element">
      <div className="popup_element-rectangle">
        <form className="popup__container-element">
          <img className="popup__element_img" src={link} alt={name} />
          <p className="popup__element_title">{name}</p>
        </form>
      </div>
    </div>
  );
}

  