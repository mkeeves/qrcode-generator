import { updateForm } from './form.js';
import { generateQRCode, downloadQRCode } from './qrcode.js';
import { showButtonFeedback } from './feedback.js';

window.addEventListener("DOMContentLoaded", () => {
  updateForm();

  const genBtn = document.getElementById("generate");
  if (genBtn) genBtn.addEventListener("click", generateQRCode);

  const downloadBtn = document.getElementById("download");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadQRCode);

  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => showButtonFeedback(button));
  });
});
