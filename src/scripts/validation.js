export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formElement, inputElement, errorMsg, settings) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.add(settings.inputErrorClass);
  errorMsgElement.textContent = errorMsg;
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.remove(settings.inputErrorClass);
  errorMsgElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList, settings)) {
    disableButton(buttonElement, settings);
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

export const disableButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

export const resetValidation = (formElement, inputList, settings) => {
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};
