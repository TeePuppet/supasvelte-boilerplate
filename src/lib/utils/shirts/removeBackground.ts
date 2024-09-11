// backgroundRemover.ts

export async function removeBackground(imageUrl: string, selectedColor: string): Promise<string> {
	const tolerance = 150;
	const expand = 1;
	const feather = 1;

	try {
		const img = await loadImage(imageUrl);
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(img, 0, 0);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const originalImageData = new Uint8ClampedArray(imageData.data);
		const { data, width, height } = imageData;

		const [baseRed, baseGreen, baseBlue] = parseColor(selectedColor);
		const mask = createTransparencyMask(
			data,
			width,
			height,
			baseRed,
			baseGreen,
			baseBlue,
			tolerance
		);

		if (expand > 0) {
			expandMask(mask, width, height, expand);
		}

		applyTransparencyAndFeathering(data, mask, width, height, feather, originalImageData);
		ctx.putImageData(imageData, 0, 0);

		return canvas.toDataURL();
	} catch (error) {
		console.error('Error in removeBackground:', error);
		throw error;
	}
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
		img.src = url;
	});
}

function parseColor(color: string): number[] {
	return [
		parseInt(color.slice(1, 3), 16),
		parseInt(color.slice(3, 5), 16),
		parseInt(color.slice(5, 7), 16)
	];
}

function createTransparencyMask(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	baseRed: number,
	baseGreen: number,
	baseBlue: number,
	tolerance: number
): Uint8Array {
	const mask = new Uint8Array(width * height);
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const distance = Math.sqrt((r - baseRed) ** 2 + (g - baseGreen) ** 2 + (b - baseBlue) ** 2);
		mask[i / 4] = distance <= tolerance ? 1 : 0;
	}
	return mask;
}

function expandMask(mask: Uint8Array, width: number, height: number, expand: number) {
	const tempMask = new Uint8Array(mask);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (tempMask[y * width + x] === 1) {
				for (let dy = -expand; dy <= expand; dy++) {
					for (let dx = -expand; dx <= expand; dx++) {
						const nx = x + dx,
							ny = y + dy;
						if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
							mask[ny * width + nx] = 1;
						}
					}
				}
			}
		}
	}
}

function applyTransparencyAndFeathering(
	data: Uint8ClampedArray,
	mask: Uint8Array,
	width: number,
	height: number,
	feather: number,
	originalImageData: Uint8ClampedArray
) {
	for (let i = 0; i < data.length; i += 4) {
		if (mask[i / 4]) {
			if (feather > 0) {
				const x = (i / 4) % width,
					y = Math.floor(i / 4 / width);
				let opaqueSides = 0;
				for (let dy = -feather; dy <= feather; dy++) {
					for (let dx = -feather; dx <= feather; dx++) {
						const nx = x + dx,
							ny = y + dy;
						if (nx >= 0 && nx < width && ny >= 0 && ny < height && !mask[ny * width + nx]) {
							opaqueSides++;
						}
					}
				}
				data[i + 3] = Math.min(255, opaqueSides * (255 / (feather * 8)));
			} else {
				data[i + 3] = 0; // Fully transparent
			}
		} else {
			data[i] = originalImageData[i];
			data[i + 1] = originalImageData[i + 1];
			data[i + 2] = originalImageData[i + 2];
			data[i + 3] = originalImageData[i + 3];
		}
	}
}
