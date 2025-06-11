window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || 'text';
  const value = params.get('text');
  const shouldDownload = params.get('download') === 'true';

  document.getElementById('mode').value = mode;
  updateForm();

  if (value) {
    setTimeout(() => {
      if (mode === 'text') {
        document.getElementById('text').value = value;
      }
      generateQRCode();
      if (shouldDownload) {
        setTimeout(() => downloadQRCode(), 100);
      }
    }, 100);
  }

  attachApiPreviewListeners();
};

function attachApiPreviewListeners() {
  document.getElementById('form-area').addEventListener('input', updateApiPreview);
  document.getElementById('mode').addEventListener('change', updateApiPreview);
}

function updateForm() {
  const mode = document.getElementById("mode").value;
  const formArea = document.getElementById("form-area");
  let html = "";

  switch (mode) {
    case "wifi":
      html = `
        <input type="text" id="ssid" placeholder="WiFi SSID" required>
        <input type="text" id="password" placeholder="WiFi Password" required>
        <select id="encryption">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>`;
      break;
    case "email":
      html = `
        <input type="email" id="email" placeholder="Recipient Email" required>
        <input type="text" id="subject" placeholder="Subject">
        <input type="text" id="body" placeholder="Body">`;
      break;
    case "sms":
      html = `
        <input type="tel" id="smsnumber" placeholder="Phone Number" required>
        <input type="text" id="smsbody" placeholder="Message">`;
      break;
    case "tel":
      html = `<input type="tel" id="phonenumber" placeholder="Phone Number" required>`;
      break;
    case "geo":
      html = `
        <input type="number" id="latitude" placeholder="Latitude" step="any" required>
        <input type="number" id="longitude" placeholder="Longitude" step="any" required>`;
      break;
    case "event":
      html = `
        <input type="text" id="eventtitle" placeholder="Event Title" required>
        <input type="datetime-local" id="start" required>
        <input type="datetime-local" id="end" required>`;
      break;
    case "vcard":
      html = `
        <input type="text" id="vname" placeholder="Full Name" required>
        <input type="text" id="vorg" placeholder="Organization">
        <input type="tel" id="vphone" placeholder="Phone">
        <input type="email" id="vemail" placeholder="Email">`;
      break;
    default:
      html = `<input type="text" id="text" placeholder="Enter text or URL" required>`;
  }

  formArea.innerHTML = html;
  updateApiPreview();
}

function updateApiPreview() {
  const mode = document.getElementById('mode').value;
  const baseUrl = 'https://qr.mkeeves.com/?mode=' + encodeURIComponent(mode);
  let params = [];

  switch (mode) {
    case 'wifi':
      const ssid = document.getElementById('ssid')?.value || '';
      const password = document.getElementById('password')?.value || '';
      const encryption = document.getElementById('encryption')?.value || 'WPA';
      params.push(`ssid=${encodeURIComponent(ssid)}`);
      params.push(`password=${encodeURIComponent(password)}`);
      params.push(`encryption=${encodeURIComponent(encryption)}`);
      break;
    case 'email':
      const email = document.getElementById('email')?.value || '';
      const subject = document.getElementById('subject')?.value || '';
      const body = document.getElementById('body')?.value || '';
      params.push(`email=${encodeURIComponent(email)}`);
      params.push(`subject=${encodeURIComponent(subject)}`);
      params.push(`body=${encodeURIComponent(body)}`);
      break;
    case 'sms':
      const smsnumber = document.getElementById('smsnumber')?.value || '';
      const smsbody = document.getElementById('smsbody')?.value || '';
      params.push(`smsnumber=${encodeURIComponent(smsnumber)}`);
      params.push(`smsbody=${encodeURIComponent(smsbody)}`);
      break;
    case 'tel':
      const phone = document.getElementById('phonenumber')?.value || '';
      params.push(`phonenumber=${encodeURIComponent(phone)}`);
      break;
    case 'geo':
      const lat = document.getElementById('latitude')?.value || '';
      const lon = document.getElementById('longitude')?.value || '';
      params.push(`latitude=${encodeURIComponent(lat)}`);
      params.push(`longitude=${encodeURIComponent(lon)}`);
      break;
    case 'event':
      const title = document.getElementById('eventtitle')?.value || '';
      const start = document.getElementById('start')?.value || '';
      const end = document.getElementById('end')?.value || '';
      params.push(`eventtitle=${encodeURIComponent(title)}`);
      params.push(`start=${encodeURIComponent(start)}`);
      params.push(`end=${encodeURIComponent(end)}`);
      break;
    case 'vcard':
      const vname = document.getElementById('vname')?.value || '';
      const vorg = document.getElementById('vorg')?.value || '';
      const vphone = document.getElementById('vphone')?.value || '';
      const vemail = document.getElementById('vemail')?.value || '';
      params.push(`vname=${encodeURIComponent(vname)}`);
      params.push(`vorg=${encodeURIComponent(vorg)}`);
      params.push(`vphone=${encodeURIComponent(vphone)}`);
      params.push(`vemail=${encodeURIComponent(vemail)}`);
      break;
    default:
      const text = document.getElementById('text')?.value || '';
      params.push(`text=${encodeURIComponent(text)}`);
  }

  const apiUrl = baseUrl + (params.length ? '&' + params.join('&') : '');
  document.getElementById('api-syntax').textContent = apiUrl;
}

function generateQRCode() {
  const qrCodeContainer = document.getElementById("qrcode");
  qrCodeContainer.innerHTML = "";

  const mode = document.getElementById("mode").value;
  let qrText = "";

  switch (mode) {
    case "wifi":
      const ssid = document.getElementById("ssid").value;
      const password = document.getElementById("password").value;
      const encryption = document.getElementById("encryption").value;
      qrText = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
      break;
    case "email":
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const body = document.getElementById("body").value;
      qrText = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      break;
    case "sms":
      const smsnumber = document.getElementById("smsnumber").value;
      const smsbody = document.getElementById("smsbody").value;
      qrText = `SMSTO:${smsnumber}:${smsbody}`;
      break;
    case "tel":
      const phone = document.getElementById("phonenumber").value;
      qrText = `tel:${phone}`;
      break;
    case "geo":
      const lat = document.getElementById("latitude").value;
      const lon = document.getElementById("longitude").value;
      qrText = `geo:${lat},${lon}`;
      break;
    case "event":
      const title = document.getElementById("eventtitle").value;
      const start = document.getElementById("start").value;
      const end = document.getElementById("end").value;
      qrText = `BEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${start.replace(/[-:]/g, "")}\nDTEND:${end.replace(/[-:]/g, "")}\nEND:VEVENT`;
      break;
    case "vcard":
      const vname = document.getElementById("vname").value;
      const vorg = document.getElementById("vorg").value;
      const vphone = document.getElementById("vphone").value;
      const vemail = document.getElementById("vemail").value;
      qrText = `BEGIN:VCARD\nVERSION:3.0\nFN:${vname}\nORG:${vorg}\nTEL:${vphone}\nEMAIL:${vemail}\nEND:VCARD`;
      break;
    default:
      qrText = document.getElementById("text").value;
  }

  new QRCode(qrCodeContainer, {
    text: qrText,
    width: 256,
    height: 256,
  });
}

function downloadQRCode() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "qr-code.png";
  link.click();
}
