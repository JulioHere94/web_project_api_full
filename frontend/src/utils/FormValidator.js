export class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
  }

  enableValidation() {
    if (!this.form) {
      console.error("Formulário não encontrado para validação.");
      return;
    }

    this.form.addEventListener("input", (event) => {
      const input = event.target;
      const errorElement = this.form.querySelector(`#${input.id}-error`);

      if (!input.validity.valid) {
        errorElement.textContent = input.validationMessage;
        input.classList.add("form__input_type_error");
      } else {
        errorElement.textContent = "";
        input.classList.remove("form__input_type_error");
      }
    });
  }
}
