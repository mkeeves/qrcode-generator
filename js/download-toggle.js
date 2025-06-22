document.addEventListener('DOMContentLoaded', () => {
  const dlToggle = document.getElementById('api-download');
  if (!dlToggle) return;

  // Restore toggle state from localStorage
  const stored = localStorage.getItem('downloadToggle');
  if (stored !== null) {
    dlToggle.checked = stored === 'true';
  }

  // Save to localStorage on change
  dlToggle.addEventListener('change', () => {
    localStorage.setItem('downloadToggle', dlToggle.checked);
  });
});
