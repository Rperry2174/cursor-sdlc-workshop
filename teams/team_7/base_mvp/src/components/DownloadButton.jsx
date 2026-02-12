import { useCallback } from 'react';

/**
 * Downloads the current photo with the selected hat overlaid as a PNG.
 *
 * How it works:
 * 1. Loads the uploaded photo and (if selected) the hat image into Image objects.
 * 2. Draws the photo onto an off-screen canvas.
 * 3. Draws the hat at the same relative position used by the CSS overlay
 *    (top 10%, horizontally centred, width 30% of photo).
 * 4. Converts the canvas to a Blob and triggers a file download.
 */
function DownloadButton({ uploadedPhoto, selectedHatData }) {
  const handleDownload = useCallback(() => {
    if (!uploadedPhoto) return;

    const photoImg = new Image();
    photoImg.crossOrigin = 'anonymous';
    photoImg.src = uploadedPhoto;

    photoImg.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = photoImg.naturalWidth;
      canvas.height = photoImg.naturalHeight;
      const ctx = canvas.getContext('2d');

      // Draw the uploaded photo
      ctx.drawImage(photoImg, 0, 0);

      if (selectedHatData) {
        // Draw the hat on top, matching the CSS overlay position
        const hatImg = new Image();
        hatImg.crossOrigin = 'anonymous';
        hatImg.src = selectedHatData.imagePath;

        hatImg.onload = () => {
          const hatWidth = canvas.width * 0.3;
          const hatHeight =
            (hatImg.naturalHeight / hatImg.naturalWidth) * hatWidth;
          const hatX = (canvas.width - hatWidth) / 2; // centred
          const hatY = canvas.height * 0.1; // top 10%

          ctx.drawImage(hatImg, hatX, hatY, hatWidth, hatHeight);
          triggerDownload(canvas);
        };

        hatImg.onerror = () => {
          // Hat failed to load — download photo without hat
          triggerDownload(canvas);
        };
      } else {
        // No hat selected — download photo only
        triggerDownload(canvas);
      }
    };
  }, [uploadedPhoto, selectedHatData]);

  return (
    <button
      className="download-button"
      onClick={handleDownload}
      disabled={!uploadedPhoto}
      aria-label="Download photo with hat"
    >
      Download
    </button>
  );
}

/** Convert canvas to blob and trigger a file save. */
function triggerDownload(canvas) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hat-try-on.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export default DownloadButton;
