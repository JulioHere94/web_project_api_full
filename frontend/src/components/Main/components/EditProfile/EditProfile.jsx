import React, { useState, useContext, useEffect, useRef } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import { FormValidator } from "../../../../utils/FormValidator";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [currentUser]);

  useEffect(() => {
    const formValidator = new FormValidator(".form");
    formValidator.enableValidation();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({ name, about: description }); // Corrigido para enviar "about"
  };

  return (
    <form
      className="popup__container form"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h1 className="container__title">Editar Perfil</h1>
      <label htmlFor="input__name" className="form__field">
        <input
          id="input__name"
          className="container__imput input-name form__input"
          placeholder="Nome"
          required
          type="text"
          minLength="2"
          maxLength="40"
          name="input__name"
          value={name}
          onChange={handleNameChange}
        />
        <span id="input__name-error" className="form__input-error"></span>
      </label>
      <label htmlFor="input__sub-name" className="form__field">
        <input
          id="input__sub-name"
          className="container__imput input__sub-name form__input"
          placeholder="Sobre mim"
          required
          type="text"
          minLength="2"
          maxLength="40"
          name="input__sub-name"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span id="input__sub-name-error" className="form__input-error"></span>
      </label>
      <button type="submit" className="container__button button__add">
        Salvar
      </button>
    </form>
  );
}
