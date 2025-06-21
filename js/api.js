export function updateApiPreview() {
  const mode = document.getElementById("mode").value;
  const inputs = document.querySelectorAll("#form-area input, #form-area select, #form-area textarea");
  const params = new URLSearchParams();
  params.append("mode", mode);

  inputs.forEach(input => {
    if (input.id && input.value) {
      params.append(input.id, input.value);
    }
  });

  const includeDownload = document.getElementById("api-download");
  if (includeDownload && includeDownload.checked) {
    params.append("download", "true");
  }

  const preview = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  const apiSyntax = document.getElementById("api-syntax");
  apiSyntax.textContent = preview;
  apiSyntax.style.cursor = "pointer";
  apiSyntax.title = "Click to copy to clipboard";

  apiSyntax.onclick = () => {
    navigator.clipboard.writeText(preview).then(() => {
      apiSyntax.textContent = "Copied!";
      setTimeout(() => apiSyntax.textContent = preview, 1500);
    });
  };
}

export function attachApiPreviewListeners() {
  const formInputs = document.querySelectorAll("#form-area input, #form-area select, #form-area textarea");
  formInputs.forEach(input => input.addEventListener("input", updateApiPreview));

  const checkbox = document.getElementById("api-download");
  if (checkbox) {
    checkbox.addEventListener("change", updateApiPreview);
  }
}
