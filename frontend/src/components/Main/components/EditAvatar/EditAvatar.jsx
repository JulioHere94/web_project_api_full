import React, { useRef, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import { FormValidator } from "../../../../utils/FormValidator";

export default function EditAvatar() {
  const avatarInputRef = useRef(null); // Criação da referência para o input
  const { handleUpdateAvatar } = useContext(CurrentUserContext); // Obtendo a função do contexto

  useEffect(() => {
    const formValidator = new FormValidator('.form');
    formValidator.enableValidation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtendo o valor do input com o useRef
    const avatarUrl = avatarInputRef.current.value;

    // Chama a função de atualização do avatar, passando o novo avatar
    handleUpdateAvatar({ avatar: avatarUrl });
  };

  return (
    <form className="popup__container form form__change" onSubmit={handleSubmit}>
      <h1 className="container__title title__change">Alterar a foto do perfil</h1>
      <label htmlFor="input__image1" className="form__field">
        <input
          id="input__image1"
          className="container__imput input__link form__input input__a"
          placeholder="Link da imagem"
          type="url"
          minLength="2"
          maxLength="200"
          required
          name="input__image1"
          ref={avatarInputRef} // Adicionando a referência ao input
        />
        <span id="input__image1-error" className="form__input-error"></span>
      </label>
      <button type="submit" className="container__button button__change">Salvar</button>
    </form>
  );
}

