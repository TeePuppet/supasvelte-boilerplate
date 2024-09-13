<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Canvas, Image as FabricImage, Point } from 'fabric';

  export let imageUrl: string; // Prop for the image URL

  let canvasElement: HTMLCanvasElement;
  let canvas: Canvas;
  let containerElement: HTMLDivElement;
  let zoomLevel = 1;

  // Function to resize canvas to fit container width
  function resizeCanvas() {
    if (containerElement && canvas) {
      const { width } = containerElement.getBoundingClientRect();
      canvas.setWidth(width);
      canvas.renderAll();
    }
  }

  // Function to load and add image to canvas
  async function addImageToCanvas(url: string) {
    try {
      const img = await FabricImage.fromURL(url, {
        crossOrigin: 'anonymous'
      });

      // Set canvas height to match image aspect ratio
      const aspectRatio = img.width! / img.height!;
      canvas.setHeight(canvas.getWidth() / aspectRatio);

      // Set image size to fit canvas
      img.scaleToWidth(canvas.getWidth());

      // Center the image on the canvas
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });

      // Set the image as the background
      canvas.backgroundImage = img;
      canvas.renderAll();
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }

  function zoomIn() {
    if (zoomLevel < 5) {
      zoomLevel *= 1.2;
      applyZoom();
    }
  }

  function zoomOut() {
    if (zoomLevel > 0.5) {
      zoomLevel /= 1.2;
      applyZoom();
    }
  }

  function applyZoom() {
    if (canvas) {
      canvas.setZoom(zoomLevel);
      canvas.renderAll();
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY;
    if (delta > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  }

  onMount(() => {
    if (browser) {
      // Create the fabric canvas instance with touch gesture support
      canvas = new Canvas(canvasElement, {
        allowTouchScrolling: true,
        stopContextMenu: true
      });

      // Enable touch gestures
      canvas.on('mouse:wheel', function(opt: { e: WheelEvent }) {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 5) zoom = 5;
        if (zoom < 0.5) zoom = 0.5;
        canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      // Handle pinch-to-zoom
      let lastDistance = 0;
      (canvas as any).on('touch:start', function(opt: { e: TouchEvent }) {
        if (opt.e.touches && opt.e.touches.length === 2) {
          lastDistance = Math.hypot(
            opt.e.touches[0].clientX - opt.e.touches[1].clientX,
            opt.e.touches[0].clientY - opt.e.touches[1].clientY
          );
        }
      });

      (canvas as any).on('touch:move', function(opt: { e: TouchEvent }) {
        if (opt.e.touches && opt.e.touches.length === 2) {
          const distance = Math.hypot(
            opt.e.touches[0].clientX - opt.e.touches[1].clientX,
            opt.e.touches[0].clientY - opt.e.touches[1].clientY
          );
          const midPoint = new Point(
            (opt.e.touches[0].clientX + opt.e.touches[1].clientX) / 2,
            (opt.e.touches[0].clientY + opt.e.touches[1].clientY) / 2
          );
          const scale = distance / lastDistance;
          let newZoom = canvas.getZoom() * scale;
          if (newZoom > 5) newZoom = 5;
          if (newZoom < 0.5) newZoom = 0.5;
          canvas.zoomToPoint(midPoint, newZoom);
          lastDistance = distance;
        } else if (opt.e.touches && opt.e.touches.length === 1) {
          // Handle panning
          const touch = opt.e.touches[0];
          const delta = new Point(touch.clientX - touch.clientX, touch.clientY - touch.clientY);
          canvas.relativePan(delta);
        }
      });

      // Call resizeCanvas on window resize
      window.addEventListener('resize', resizeCanvas);
      // Call resizeCanvas initially to ensure it fits the container
      resizeCanvas();

      // Add the image to the canvas
      addImageToCanvas(imageUrl);

      // Add wheel event listener for zooming
      canvasElement.addEventListener('wheel', handleWheel, { passive: false });
    }
  });

  onDestroy(() => {
    if (browser) {
      // Remove event listeners on component destruction
      window.removeEventListener('resize', resizeCanvas);
      canvasElement.removeEventListener('wheel', handleWheel);
      // Dispose of the canvas to prevent memory leaks
      if (canvas) {
        canvas.dispose();
      }
    }
  });
</script>

<style>
  .canvas-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    touch-action: none;
  }
  :global(.canvas-container canvas) {
    width: 100% !important;
  }
  .zoom-controls {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1000;
  }
  button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 16px;
  }
</style>

<div class="canvas-container" bind:this={containerElement}>
  <canvas bind:this={canvasElement}></canvas>
  <div class="zoom-controls">
    <button on:click={zoomIn}>+</button>
    <button on:click={zoomOut}>-</button>
  </div>
</div>