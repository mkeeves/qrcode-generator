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
