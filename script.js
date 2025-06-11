let lastQRCode = null;

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function showErrorMessage(input) {
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("error-message")) {
    error = document.createElement("div");
    error.className = "error-message";
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  error.textContent = input.validationMessage;
  error.classList.add("error-visible");
}

function clearErrorMessages() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
}

function updateForm() {
  const mode = document.getElementById("mode").value;
  const formArea = document.getElementById("form-area");
  let html = "";

  const required = "required";
  const typeText = () => `type="text" ${required} pattern=".*\\S.*"`;

  switch (mode) {
    case "wifi":
      html = `
        <input ${typeText()} id="ssid" placeholder="WiFi SSID">
        <input ${typeText()} id="password" placeholder="WiFi Password">
        <select id="encryption">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>`;
      break;
    case "email":
      html = `
        <input type="email" id="email" placeholder="Recipient Email" ${required}>
        <input ${typeText()} id="subject" placeholder="Subject">
        <input ${typeText()} id="body" placeholder="Body">`;
      break;
    case "sms":
      html = `
        <input type="tel" id="smsnumber" placeholder="Phone Number" ${required}>
        <input ${typeText()} id="smsbody" placeholder="Message">`;
      break;
    case "tel":
      html = `<input type="tel" id="phonenumber" placeholder="Phone Number" ${required}>`;
      break;
    case "geo":
      html = `
        <input type="number" id="latitude" placeholder="Latitude" step="any" required>
        <input type="number" id="longitude" placeholder="Longitude" step="any" required>`;
      break;
    case "event":
      html = `
        <input ${typeText()} id="eventtitle" placeholder="Event Title">
        <input type="datetime-local" id="start" ${required}>
        <input type="datetime-local" id="end" ${required}>`;
      break;
    case "vcard":
      html = `
        <input ${typeText()} id="vname" placeholder="Full Name">
        <input ${typeText()} id="vorg" placeholder="Organization">
        <input type="tel" id="vphone" placeholder="Phone">
        <input type="email" id="vemail" placeholder="Email">`;
      break;
    default:
      html = `<input ${typeText()} id="text" placeholder="Enter text or URL">`;
  }

  formArea.innerHTML = html;
  document.getElementById("qrcode").innerHTML = "";
  lastQRCode = null;
}

function generateQRCode() {
  clearErrorMessages();
  const formInputs = document.querySelectorAll("#form-area input:required");
  for (const input of formInputs) {
    if (!input.checkValidity()) {
      showErrorMessage(input);
      input.focus();
      return;
    }
  }

  const mode = document.getElementById("mode").value;
  let data = "";

  switch (mode) {
    case "wifi":
      const ssid = document.getElementById("ssid").value;
      const password = document.getElementById("password").value;
      const enc = document.getElementById("encryption").value;
      data = `WIFI:T:${enc};S:${ssid};P:${password};;`;
      break;
    case "email":
      const email = document.getElementById("email").value;
      const subject = encodeURIComponent(document.getElementById("subject").value);
      const body = encodeURIComponent(document.getElementById("body").value);
      data = `mailto:${email}?subject=${subject}&body=${body}`;
      break;
    case "sms":
      const number = document.getElementById("smsnumber").value;
      const msg = encodeURIComponent(document.getElementById("smsbody").value);
      data = `sms:${number}?body=${msg}`;
      break;
    case "tel":
      data = `tel:${document.getElementById("phonenumber").value}`;
      break;
    case "geo":
      const lat = document.getElementById("latitude").value;
      const lon = document.getElementById("longitude").value;
      data = `geo:${lat},${lon}`;
      break;
    case "event":
      const title = document.getElementById("eventtitle").value;
      const start = document.getElementById("start").value.replace(/[-:]/g, "").replace("T", "");
      const end = document.getElementById("end").value.replace(/[-:]/g, "").replace("T", "");
      data = `BEGIN:VEVENT\\nSUMMARY:${title}\\nDTSTART:${start}\\nDTEND:${end}\\nEND:VEVENT`;
      break;
    case "vcard":
      const vname = document.getElementById("vname").value;
      const vorg = document.getElementById("vorg").value;
      const vphone = document.getElementById("vphone").value;
      const vemail = document.getElementById("vemail").value;
      data = `BEGIN:VCARD\\nVERSION:3.0\\nFN:${vname}\\nORG:${vorg}\\nTEL:${vphone}\\nEMAIL:${vemail}\\nEND:VCARD`;
      break;
    default:
      data = document.getElementById("text").value;
  }

  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";
  if (data.trim()) {
    const qr = new QRCode(qrcodeContainer, {
      text: data,
      width: 256,
      height: 256,
    });
    lastQRCode = qr;
  }
}

function downloadQRCode() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) {
    alert("Please generate a QR code first.");
    return;
  }
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL();
  link.click();
}

window.onload = updateForm;
