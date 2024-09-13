// src/lib/utils/shirts/removeBackground.ts

export interface ImageData {
	url: string;
	width: number;
	height: number;
	content_type: string;
	processed?: string;
  }
  
  interface RGBColor {
	r: number;
	g: number;
	b: number;
  }
  
  const SAMPLE_SIZE = 20;        // Size of the sample square (e.g., 20x20 pixels)
  const TOLERANCE_LOW = 2;       // Lower tolerance for color difference
  const TOLERANCE_HIGH = 80;     // Upper tolerance for color difference
  const BLUR_RADIUS = 2;         // Radius for Gaussian blur
  const THRESHOLD = 128;         // Threshold for final alpha adjustment
  const EDGE_CONTRACTION = 2;    // Number of pixels to contract the mask edges
  
  /**
   * Removes the background from an image by processing its pixels.
   * @param image The ImageData object representing the image.
   * @param hiddenCanvas The hidden canvas element for processing.
   * @param hiddenCtx The 2D rendering context of the hidden canvas.
   * @returns A Promise that resolves to the processed data URL of the image.
   */
  export async function removeBackground(
	image: ImageData,
	hiddenCanvas: HTMLCanvasElement,
	hiddenCtx: CanvasRenderingContext2D
  ): Promise<{ processedDataURL: string; finalAlphaData: Uint8ClampedArray; width: number; height: number }> {
	return new Promise<{ processedDataURL: string; finalAlphaData: Uint8ClampedArray; width: number; height: number }>(async (resolve, reject) => {
	  try {
		const img = new Image();
		img.crossOrigin = 'Anonymous'; // Enable CORS
		img.src = image.url;
  
		img.onload = () => {
		  hiddenCanvas.width = img.width;
		  hiddenCanvas.height = img.height;
		  hiddenCtx.drawImage(img, 0, 0);
  
		  const imageDataObj = hiddenCtx.getImageData(0, 0, img.width, img.height);
		  const data = imageDataObj.data;
  
		  // Sample the background color
		  const bgColor = sampleBackgroundColors(data, img.width, img.height);
  
		  // Create alphaData based on color distance
		  const alphaData = new Uint8ClampedArray(img.width * img.height);
  
		  for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
  
			const distance = colorDistance({ r, g, b }, bgColor);
  
			let alpha: number;
			if (distance <= TOLERANCE_LOW) {
			  alpha = 0;
			} else if (distance >= TOLERANCE_HIGH) {
			  alpha = 255;
			} else {
			  alpha = ((distance - TOLERANCE_LOW) / (TOLERANCE_HIGH - TOLERANCE_LOW)) * 255;
			  alpha = Math.min(Math.max(alpha, 0), 255);
			}
  
			alphaData[i / 4] = alpha;
		  }
  
		  // Contract mask edges
		  const contractedAlphaData = contractMaskEdges(alphaData, img.width, img.height, EDGE_CONTRACTION);
  
		  // Apply Gaussian blur (separable)
		  const blurredAlphaData = gaussianBlurAlpha(contractedAlphaData, img.width, img.height, BLUR_RADIUS);
  
		  // Threshold alpha
		  const finalAlphaData = thresholdAlpha(alphaData, blurredAlphaData, img.width, img.height, THRESHOLD);
  
		  // Update the image data with the new alpha values
		  for (let i = 0; i < data.length; i += 4) {
			const index = i / 4;
			data[i + 3] = finalAlphaData[index];
		  }
  
		  // Put the processed data back to the canvas
		  hiddenCtx.putImageData(imageDataObj, 0, 0);
  
		  // Convert the canvas to a data URL
		  const processedDataURL = hiddenCanvas.toDataURL();
  
		  resolve({
			processedDataURL,
			finalAlphaData,
			width: img.width,
			height: img.height
		  });
		};
  
		img.onerror = () => {
		  reject(new Error('Failed to load image for processing.'));
		};
	  } catch (error) {
		reject(error);
	  }
	});
  }
  
  /**
   * Samples the background colors from the corners of the image.
   * @param data The pixel data of the image.
   * @param width The width of the image.
   * @param height The height of the image.
   * @returns The average RGB color of the background.
   */
  function sampleBackgroundColors(data: Uint8ClampedArray, width: number, height: number): RGBColor {
	const corners = [
	  { xStart: 0, yStart: 0 },                               // Top-left
	  { xStart: width - SAMPLE_SIZE, yStart: 0 },             // Top-right
	  { xStart: 0, yStart: height - SAMPLE_SIZE },            // Bottom-left
	  { xStart: width - SAMPLE_SIZE, yStart: height - SAMPLE_SIZE } // Bottom-right
	];
  
	let totalR = 0, totalG = 0, totalB = 0;
	let count = 0;
  
	corners.forEach(corner => {
	  for (let y = corner.yStart; y < corner.yStart + SAMPLE_SIZE; y++) {
		for (let x = corner.xStart; x < corner.xStart + SAMPLE_SIZE; x++) {
		  // Ensure within bounds
		  if (x >= 0 && x < width && y >= 0 && y < height) {
			const index = (y * width + x) * 4;
			totalR += data[index];
			totalG += data[index + 1];
			totalB += data[index + 2];
			count++;
		  }
		}
	  }
	});
  
	if (count === 0) {
	  return { r: 0, g: 0, b: 0 };
	}
  
	// Compute average background color
	const avgR = totalR / count;
	const avgG = totalG / count;
	const avgB = totalB / count;
  
	return { r: avgR, g: avgG, b: avgB };
  }
  
  /**
   * Calculates the Euclidean distance between two RGB colors.
   * @param color1 The first RGB color.
   * @param color2 The second RGB color.
   * @returns The color distance.
   */
  function colorDistance(color1: RGBColor, color2: RGBColor): number {
	const dr = color1.r - color2.r;
	const dg = color1.g - color2.g;
	const db = color1.b - color2.b;
	return Math.sqrt(dr * dr + dg * dg + db * db);
  }
  
  /**
   * Contracts the edges of the alpha mask to reduce noise.
   * @param alphaData The initial alpha data.
   * @param width The width of the image.
   * @param height The height of the image.
   * @param contraction The number of pixels to contract.
   * @returns The contracted alpha data.
   */
  function contractMaskEdges(alphaData: Uint8ClampedArray, width: number, height: number, contraction: number): Uint8ClampedArray {
	let contractedAlpha = new Uint8ClampedArray(alphaData.length);
	contractedAlpha.set(alphaData);
  
	for (let c = 0; c < contraction; c++) {
	  const tempAlpha = new Uint8ClampedArray(contractedAlpha.length).fill(0);
  
	  for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
		  const idx = y * width + x;
		  if (contractedAlpha[idx] === 255) {
			let shouldSet = true;
			// Check all 8 neighbors
			for (let ky = -1; ky <= 1; ky++) {
			  for (let kx = -1; kx <= 1; kx++) {
				if (ky === 0 && kx === 0) continue; // Skip self
				const nx = x + kx;
				const ny = y + ky;
				if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
				  shouldSet = false;
				  break;
				}
				const neighborIdx = ny * width + nx;
				if (contractedAlpha[neighborIdx] !== 255) {
				  shouldSet = false;
				  break;
				}
			  }
			  if (!shouldSet) break;
			}
			if (shouldSet) {
			  tempAlpha[idx] = 255;
			}
		  }
		}
	  }
  
	  // Update contractedAlpha with tempAlpha
	  for (let i = 0; i < contractedAlpha.length; i++) {
		if (tempAlpha[i] === 255) {
		  contractedAlpha[i] = 255;
		}
	  }
	}
  
	return contractedAlpha;
  }
  
  /**
   * Applies a separable Gaussian blur to the alpha mask.
   * @param alphaData The alpha data to blur.
   * @param width The width of the image.
   * @param height The height of the image.
   * @param radius The radius of the Gaussian blur.
   * @returns The blurred alpha data.
   */
  function gaussianBlurAlpha(alphaData: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
	if (radius < 1) return alphaData;
  
	const sigma = radius / 3;
	const kernelSize = 2 * radius + 1;
	const kernel = new Float32Array(kernelSize);
	const half = radius;
	let sum = 0;
  
	// Generate 1D Gaussian kernel
	for (let i = 0; i < kernelSize; i++) {
	  const x = i - half;
	  kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
	  sum += kernel[i];
	}
  
	// Normalize kernel
	for (let i = 0; i < kernelSize; i++) {
	  kernel[i] /= sum;
	}
  
	// Temporary array for intermediate results
	const tempData = new Float32Array(width * height);
  
	// Horizontal pass
	for (let y = 0; y < height; y++) {
	  for (let x = 0; x < width; x++) {
		let acc = 0;
		for (let k = -half; k <= half; k++) {
		  const nx = x + k;
		  if (nx >= 0 && nx < width) {
			acc += alphaData[y * width + nx] * kernel[k + half];
		  }
		}
		tempData[y * width + x] = acc;
	  }
	}
  
	// Vertical pass
	const blurredAlpha = new Float32Array(width * height);
	for (let x = 0; x < width; x++) {
	  for (let y = 0; y < height; y++) {
		let acc = 0;
		for (let k = -half; k <= half; k++) {
		  const ny = y + k;
		  if (ny >= 0 && ny < height) {
			acc += tempData[ny * width + x] * kernel[k + half];
		  }
		}
		blurredAlpha[y * width + x] = acc;
	  }
	}
  
	// Convert to Uint8ClampedArray
	const finalAlpha = new Uint8ClampedArray(width * height);
	for (let i = 0; i < blurredAlpha.length; i++) {
	  finalAlpha[i] = Math.min(255, Math.max(0, Math.round(blurredAlpha[i])));
	}
  
	return finalAlpha;
  }
  
  /**
   * Thresholds the alpha mask based on the blurred alpha data.
   * @param alphaData The original alpha data.
   * @param blurredAlphaData The blurred alpha data.
   * @param width The width of the image.
   * @param height The height of the image.
   * @param threshold The threshold value.
   * @returns The final thresholded alpha data.
   */
  function thresholdAlpha(alphaData: Uint8ClampedArray, blurredAlphaData: Uint8ClampedArray, width: number, height: number, threshold: number): Uint8ClampedArray {
	const finalAlphaData = new Uint8ClampedArray(width * height);
  
	for (let i = 0; i < width * height; i++) {
	  if (alphaData[i] === 255) {
		finalAlphaData[i] = 255;
	  } else if (blurredAlphaData[i] > threshold) {
		finalAlphaData[i] = 255;
	  } else {
		finalAlphaData[i] = 0;
	  }
	}
  
	return finalAlphaData;
  }
  