import { useEffect, useState } from "react";
import { FormValidator } from "../../../../utils/FormValidator";

export default function NewCard({ onAddCard }) {
  const [title, setTitle] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validator = new FormValidator(".form");
    validator.enableValidation();
  }, []);

  useEffect(() => {
    // Verifica se os campos estão preenchidos e válidos
    setIsFormValid(title.trim().length >= 2 && imageLink.trim().length >= 2);
  }, [title, imageLink]);

  function handleSubmit(e) {
    e.preventDefault();
    const newCardData = {
      name: title,
      link: imageLink,
    };
    onAddCard(newCardData);
  }

  return (
    <form
      className="popup__container add__container form"
      onSubmit={handleSubmit}
    >
      <h1 className="container__title">Novo local</h1>
      <label htmlFor="input__title" className="form__field">
        <input
          id="input__title"
          className="container__imput input-title form__input"
          type="text"
          minLength="2"
          maxLength="40"
          required
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <span id="input__title-error" className="form__input-error"></span>
      </label>
      <label htmlFor="input__link" className="form__field">
        <input
          id="input__link"
          className="container__imput input__link form__input"
          placeholder="Link da imagem"
          type="url"
          minLength="2"
          maxLength="200"
          required
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />
        <span id="input__link-error" className="form__input-error"></span>
      </label>
      <button
        type="submit"
        className={`container__button button__add ${
          !isFormValid ? "form__button_disabled" : ""
        }`}
        disabled={!isFormValid}
      >
        Criar
      </button>
    </form>
  );
}
