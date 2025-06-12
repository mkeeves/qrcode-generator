// Handle query params for pseudo-API mode
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
};
