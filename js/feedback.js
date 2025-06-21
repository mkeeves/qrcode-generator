export function showButtonFeedback(button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Processing...";
  button.classList.add("processing");

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    button.classList.remove("processing");
  }, 1000);
}
