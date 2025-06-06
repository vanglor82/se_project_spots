export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving...",
  deleteText = "Delete",
  deletingText = "Deleting..."
) {
  if (isLoading === "saving") {
    btn.textContent = loadingText;
  } else if (isLoading === "deleting") {
    btn.textContent = deletingText;
  } else {
    btn.textContent = btn.classList.contains("modal__submit-btn_delete") ? deleteText : defaultText;
  }
}


