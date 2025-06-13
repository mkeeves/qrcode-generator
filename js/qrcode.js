function generateQRCode() {
  const form = document.getElementById("form-area");
  if (!form.checkValidity()) {
    form.querySelectorAll("input, textarea, select").forEach(el => el.reportValidity());
    return;
  }
  
  const mode = document.getElementById("mode").value;
  const inputs = document.querySelectorAll("#form-area input, #form-area select, #form-area textarea");

  const data = {};
  inputs.forEach(input => data[input.id] = input.value);

  let qrText = "";
  switch (mode) {
    case "text":
      qrText = data.text;
      break;
    case "wifi":
      qrText = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
      break;
    case "email":
      qrText = `mailto:${data.to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
      break;
    case "sms":
      qrText = `sms:${data.number}?body=${encodeURIComponent(data.message)}`;
      break;
    case "tel":
      qrText = `tel:${data.number}`;
      break;
    case "geo":
      qrText = `geo:${data.lat},${data.lon}`;
      break;
    case "event":
      qrText = `BEGIN:VEVENT\nSUMMARY:${data.summary}\nLOCATION:${data.location}\nDTSTART:${data.start.replace(/[-:]/g, '')}\nDTEND:${data.end.replace(/[-:]/g, '')}\nEND:VEVENT`;
      break;
    case "vcard":
      qrText = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nORG:${data.org}\nTITLE:${data.title}\nEMAIL:${data.email}\nTEL:${data.tel}\nEND:VCARD`;
      break;
  }

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: qrText,
    width: 256,
    height: 256
  });

  updateApiPreview();
}

function downloadQRCode() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "qrcode.png";
  link.click();
}
