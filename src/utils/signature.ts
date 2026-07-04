export const signatureImageBase64 = (() => {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 100);
    ctx.font = 'italic 36px "Brush Script MT", cursive, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Verified', 40, 60);
  }
  return canvas.toDataURL('image/png');
})();
