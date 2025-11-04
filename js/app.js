import { updateForm } from './form.js';
import { generateQRCode, downloadQRCode } from './qrcode.js';
import { showButtonFeedback } from './feedback.js';

window.addEventListener("DOMContentLoaded", () => {
  updateForm();

  const genBtn = document.getElementById("generate");
  if (genBtn) genBtn.addEventListener("click", generateQRCode);

  const downloadBtn = document.getElementById("download");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadQRCode);

  const modeSelector = document.getElementById("mode");
  if (modeSelector) {
    modeSelector.addEventListener("change", updateForm);
  }

  // Add processing feedback to buttons, but exclude dark mode toggle buttons
  document.querySelectorAll("button").forEach(button => {
    // Skip dark mode toggle buttons
    if (button.classList.contains('dark-mode-toggle-button') || 
        button.classList.contains('theme-option') ||
        button.closest('.dark-mode-toggle-container')) {
      return;
    }
    button.addEventListener("click", function(e) {
      // Double-check at click time to handle dynamically created buttons
      if (this.classList.contains('dark-mode-toggle-button') || 
          this.classList.contains('theme-option') ||
          this.closest('.dark-mode-toggle-container')) {
        return;
      }
      showButtonFeedback(this);
    });
  });

});
