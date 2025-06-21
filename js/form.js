import { generateQRCode, downloadQRCode } from './qrcode.js';
import { attachApiPreviewListeners, updateApiPreview } from './api.js';

export function updateForm() {
  const mode = document.getElementById("mode").value;
  const formArea = document.getElementById("form-area");
  formArea.innerHTML = "";

  const fields = {
    text: [{ id: "text", label: "Text/URL", type: "text" }],
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
    tel: [{ id: "number", label: "Phone Number", type: "text" }],
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
