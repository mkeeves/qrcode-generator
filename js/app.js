window.onload = function () {
  updateForm();

  const params = new URLSearchParams(window.location.search);
  if (params.has("mode")) {
    document.getElementById("mode").value = params.get("mode");
    updateForm();
    for (const [key, value] of params.entries()) {
      const el = document.getElementById(key);
      if (el) el.value = value;
    }
    generateQRCode();
    if (params.get("download") === "true") {
      setTimeout(downloadQRCode, 100);
    }
  }

  document.querySelectorAll("button").forEach(button => {
    const originalHandler = button.onclick;
    button.onclick = function(event) {
      if (originalHandler) originalHandler.call(this, event);
      showButtonFeedback(this);
    };
  });
};
