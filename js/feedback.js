function showButtonFeedback(button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Processing...";
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1000);
}
