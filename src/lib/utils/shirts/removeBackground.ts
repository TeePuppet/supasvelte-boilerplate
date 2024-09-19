export async function removeBackground(imageUrl: string) {
	const apiUrl = 'https://api.pixian.ai/api/v2/remove-background';
	const apiKey = 'pxv2i6es2re342p';
	const apiSecret = '33etvt2592e5sae2su2audghtmc0pi01g5r96ehbo7862f0b0bef';

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			body: new URLSearchParams({
				'image.url': imageUrl, // Replace with your image URL
				test: 'true', // true or false
				'result.crop_to_foreground': 'true', // true or false
				'result.margin': '20px',
				'output.format': 'png'
			}),
			headers: {
				Authorization: 'Basic ' + btoa(`${apiKey}:${apiSecret}`)
			}
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status} - ${await response.text()}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const base64Image = arrayBufferToBase64(arrayBuffer);
		const imgSrc = `data:image/png;base64,${base64Image}`;

		// Return image data to use in <img /> tag
		return imgSrc;
	} catch (error) {
		console.error('Error removing background:', error);
		throw error;
	}
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}


import { browser } from '$app/environment';

interface ImageAnalysisResult {
  dominantColor: string;
  base64Image: string;
}

export async function getImageAnalysis(imageUrl: string): Promise<ImageAnalysisResult> {
  if (!browser) {
    return { dominantColor: '#000000', base64Image: '' }; // Default for server-side rendering
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colorCounts: { [key: string]: number } = {};

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        if (a === 0) continue; // Skip fully transparent pixels

        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      let dominantColor = '#000000';
      let maxCount = 0;
      for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
          dominantColor = color;
          maxCount = count;
        }
      }

      // Get base64 representation of the image
      const base64Image = canvas.toDataURL('image/png').split(',')[1];

      resolve({ dominantColor, base64Image });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}