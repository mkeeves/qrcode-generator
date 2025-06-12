window.onload = function () {
  updateForm();
  attachApiPreviewListeners();

  // Support API usage via query params
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
};

function updateForm() {
  const mode = document.getElementById("mode").value;
  const formArea = document.getElementById("form-area");
  formArea.innerHTML = "";

  const fields = {
    text: [
      { id: "text", label: "Text/URL", type: "text" }
    ],
    wifi: [
      { id: "ssid", label: "SSID", type: "text" },
      { id: "password", label: "Password", type: "text" },
      { id: "encryption", label: "Encryption", type: "select", options: ["WPA", "WEP", "nopass"] }
    ],
    email: [
      { id: "to", label: "To", type: "email" },
      { id: "subject", label: "Subject", type: "text" },
      { id: "body", label: "Body", type: "textarea" }
    ],
    sms: [
      { id: "number", label: "Number", type: "text" },
      { id: "message", label: "Message", type: "textarea" }
    ],
    tel: [
      { id: "number", label: "Phone Number", type: "text" }
    ],
    geo: [
      { id: "lat", label: "Latitude", type: "text" },
      { id: "lon", label: "Longitude", type: "text" }
    ],
    event: [
      { id: "summary", label: "Summary", type: "text" },
      { id: "location", label: "Location", type: "text" },
      { id: "start", label: "Start Time", type: "datetime-local" },
      { id: "end", label: "End Time", type: "datetime-local" }
    ],
    vcard: [
      { id: "name", label: "Full Name", type: "text" },
      { id: "org", label: "Organisation", type: "text" },
      { id: "title", label: "Title", type: "text" },
      { id: "email", label: "Email", type: "email" },
      { id: "tel", label: "Phone", type: "text" }
    ]
  };

  const selectedFields = fields[mode] || [];
  selectedFields.forEach(field => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("form-field");

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.innerText = field.label;

    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.innerText = opt;
        input.appendChild(option);
      });
    } else if (field.type === "textarea") {
      input = document.createElement("textarea");
    } else {
      input = document.createElement("input");
      input.type = field.type;
    }

    input.id = field.id;
    input.required = true;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    formArea.appendChild(wrapper);
  });

  attachApiPreviewListeners();
  updateApiPreview();
}

function attachApiPreviewListeners() {
  const formInputs = document.querySelectorAll("#form-area input, #form-area select, #form-area textarea");
  formInputs.forEach(input => input.addEventListener("input", updateApiPreview));

  const checkbox = document.getElementById("api-download");
  if (checkbox) {
    checkbox.addEventListener("change", updateApiPreview);
  }
}

function generateQRCode() {
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

function updateApiPreview() {
  const mode = document.getElementById("mode").value;
  const inputs = document.querySelectorAll("#form-area input, #form-area select");
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
  document.getElementById("api-syntax").textContent = preview;

  const copyBtn = document.getElementById("copy-api-url");
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(preview).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy URL", 1500);
      });
    };
  }
}

// Also call this after form renders or mode changes
updateApiPreview();
