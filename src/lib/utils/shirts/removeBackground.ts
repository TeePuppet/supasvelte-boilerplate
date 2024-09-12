// backgroundRemoverUtils.ts

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
	  const img = new Image();
	  img.crossOrigin = "Anonymous";
	  img.onload = () => resolve(img);
	  img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
	  img.src = url;
	});
  }
  
  export function parseColor(color: string): [number, number, number] {
	return [
	  parseInt(color.slice(1, 3), 16),
	  parseInt(color.slice(3, 5), 16),
	  parseInt(color.slice(5, 7), 16)
	];
  }
  
  export function createTransparencyMask(data: Uint8ClampedArray, width: number, height: number, baseRed: number, baseGreen: number, baseBlue: number, tolerance: number): Uint8Array {
	const mask = new Uint8Array(width * height);
	for (let i = 0; i < data.length; i += 4) {
	  const r = data[i];
	  const g = data[i + 1];
	  const b = data[i + 2];
	  const distance = Math.sqrt(
		(r - baseRed) ** 2 +
		(g - baseGreen) ** 2 +
		(b - baseBlue) ** 2
	  );
	  mask[i / 4] = distance <= tolerance ? 1 : 0;
	}
	return mask;
  }
  
  export function expandMask(mask: Uint8Array, width: number, height: number, expand: number): void {
	const tempMask = new Uint8Array(mask);
	for (let y = 0; y < height; y++) {
	  for (let x = 0; x < width; x++) {
		if (tempMask[y * width + x] === 1) {
		  for (let dy = -expand; dy <= expand; dy++) {
			for (let dx = -expand; dx <= expand; dx++) {
			  const nx = x + dx, ny = y + dy;
			  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
				mask[ny * width + nx] = 1;
			  }
			}
		  }
		}
	  }
	}
  }
  
  export function applyTransparencyAndFeathering(data: Uint8ClampedArray, mask: Uint8Array, width: number, height: number, feather: number, originalImageData: Uint8ClampedArray): void {
	for (let i = 0; i < data.length; i += 4) {
	  if (mask[i / 4]) {
		if (feather > 0) {
		  const x = (i / 4) % width, y = Math.floor((i / 4) / width);
		  let opaqueSides = 0;
		  for (let dy = -feather; dy <= feather; dy++) {
			for (let dx = -feather; dx <= feather; dx++) {
			  const nx = x + dx, ny = y + dy;
			  if (nx >= 0 && nx < width && ny >= 0 && ny < height && !mask[ny * width + nx]) {
				opaqueSides++;
			  }
			}
		  }
		  data[i + 3] = Math.min(255, opaqueSides * (255 / (feather * 8)));
		} else {
		  data[i + 3] = 0;  // Fully transparent
		}
	  } else {
		data[i] = originalImageData[i];
		data[i + 1] = originalImageData[i + 1];
		data[i + 2] = originalImageData[i + 2];
		data[i + 3] = originalImageData[i + 3];
	  }
	}
  }
  
  export function sampleCornersColor(ctx: CanvasRenderingContext2D, width: number, height: number): string {
	const sampleSize = 10;
	const corners = [
	  { x: 0, y: 0 },                       // Top-left
	  { x: width - sampleSize, y: 0 },      // Top-right
	  { x: 0, y: height - sampleSize },     // Bottom-left
	  { x: width - sampleSize, y: height - sampleSize } // Bottom-right
	];
  
	const colorCount: {[key: string]: number} = {};
	let maxCount = 0;
	let dominantColor = '#FFFFFF';
  
	corners.forEach(corner => {
	  const cornerData = ctx.getImageData(corner.x, corner.y, sampleSize, sampleSize).data;
	  for (let i = 0; i < cornerData.length; i += 4) {
		const r = cornerData[i];
		const g = cornerData[i + 1];
		const b = cornerData[i + 2];
		const hex = rgbToHex(r, g, b);
		colorCount[hex] = (colorCount[hex] || 0) + 1;
		if (colorCount[hex] > maxCount) {
		  maxCount = colorCount[hex];
		  dominantColor = hex;
		}
	  }
	});
  
	return dominantColor;
  }
  
  export function rgbToHex(r: number, g: number, b: number): string {
	return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }