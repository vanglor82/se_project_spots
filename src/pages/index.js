import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
// import { data } from "autoprefixer";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "844e3621-5dd8-4490-b067-bc8857bf0391",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((data) => {
      const cardElement = getCardElement(data);
      cardsList.append(cardElement);
    });
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImage.src = user.avatar;
  })
  .catch(console.error);

const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileAddBtn = document.querySelector(".profile__add-btn");
const profileImageBtn = document.querySelector(".profile__image-btn");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

const imageModal = document.querySelector("#image-modal");
const imageFormElement = imageModal.querySelector(".modal__form");
const imageModalInput = imageModal.querySelector("#profile-image-input");
// const imageModalSubmit = imageModal.querySelector(".modal__submit-btn");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const addModal = document.querySelector("#add-modal");
const addFormElement = addModal.querySelector(".modal__form");
const addModalLinkInput = addModal.querySelector("#add-link-input");
const addModalCaptionInput = addModal.querySelector("#add-caption-input");
const addModalSubmit = addModal.querySelector(".modal__submit-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = deleteModal.querySelector(".modal__form");
// const deleteModalSubmit = deleteModal.querySelector(
//   ".modal__submit-btn"
// );

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const closeButtons = document.querySelectorAll(".modal__close-btn");

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  cardNameElement.textContent = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteCard (cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function onEscPress(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}

function onClickOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", onClickOverlay);
  document.addEventListener("keydown", onEscPress);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", onClickOverlay);
  document.removeEventListener("keydown", onEscPress);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then(() => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error);
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  api.addCard({
    name: addModalCaptionInput.value,
    link: addModalLinkInput.value,
  })
  .then((data) => {
    const cardElement = getCardElement(data);
    cardsList.prepend(cardElement);
    evt.target.reset();
    disableButton(addModalSubmit, settings);
    closeModal(addModal);
  })
  .catch(console.error);
}


  // Uncomment the following lines if you want to add the card to the UI immediately
  // const inputValues = {
  //   name: addModalCaptionInput.value,
  //   link: addModalLinkInput.value,
  // };

  // const cardElement = getCardElement(inputValues);
  // cardsList.prepend(cardElement);
  // evt.target.reset();
  // disableButton(addModalSubmit, settings);
  // closeModal(addModal);


function handleImageFormSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo(imageModalInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      evt.target.reset();
      closeModal(imageModal);
    })
    .catch(console.error);
}

function handleDeleteFormSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

profileAddBtn.addEventListener("click", () => {
  openModal(addModal);
});

profileImageBtn.addEventListener("click", () => {
  openModal(imageModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
addFormElement.addEventListener("submit", handleAddFormSubmit);
imageFormElement.addEventListener("submit", handleImageFormSubmit);
deleteFormElement.addEventListener("submit", handleDeleteFormSubmit);

enableValidation(settings);
