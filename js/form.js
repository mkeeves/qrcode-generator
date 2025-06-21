function updateForm() {
  const mode = document.getElementById("mode").value;
  const formArea = document.getElementById("form-area");
  formArea.innerHTML = "";

  const fieldMap = {
    text: ["data"],
    wifi: ["ssid", "password", "encryption"],
    email: ["email", "subject", "body"],
    sms: ["number", "message"],
    tel: ["number"],
    geo: ["lat", "lon"],
    event: ["summary", "location", "start", "end"],
    vcard: ["name", "phone", "email", "org", "url"]
  };

  const placeholders = {
    data: "Text or URL",
    ssid: "WiFi Network Name",
    password: "Password",
    encryption: "WPA/WEP",
    email: "email@example.com",
    subject: "Subject",
    body: "Message body",
    number: "e.g. +441234567890",
    message: "Text message",
    lat: "Latitude",
    lon: "Longitude",
    summary: "Event Title",
    location: "Event Location",
    start: "Start DateTime (YYYY-MM-DDTHH:MM)",
    end: "End DateTime (YYYY-MM-DDTHH:MM)",
    name: "Full Name",
    phone: "Phone Number",
    org: "Organisation",
    url: "https://..."
  };

  const fields = fieldMap[mode] || [];
  fields.forEach(field => {
    const label = document.createElement("label");
    label.textContent = field.charAt(0).toUpperCase() + field.slice(1);
    label.setAttribute("for", field);

    const input = document.createElement("input");
    input.type = "text";
    input.id = field;
    input.placeholder = placeholders[field] || "";
    input.required = true;

    formArea.appendChild(label);
    formArea.appendChild(input);
  });

  // ✅ Button rebinding — only new code added
  const generateBtn = document.getElementById("generate");
  if (generateBtn) generateBtn.addEventListener("click", generateQRCode);

  const downloadBtn = document.getElementById("download");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadQRCode);

  attachApiPreviewListeners();
  updateApiPreview();
}
