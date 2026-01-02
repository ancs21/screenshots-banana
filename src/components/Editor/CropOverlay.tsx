import { useRef, useState, useCallback, useEffect } from 'preact/hooks';
import {
  isCropping,
  cropRegion,
  imageData,
  setImage,
} from '../../store/editor';

interface DragState {
  isDragging: boolean;
  dragType: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
  startX: number;
  startY: number;
  startRegion: { x: number; y: number; width: number; height: number };
}

export function CropOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startX: 0,
    startY: 0,
    startRegion: { x: 0, y: 0, width: 0, height: 0 },
  });

  // Initialize crop region to full image
  useEffect(() => {
    if (!cropRegion.value && dimensions.width > 0) {
      cropRegion.value = {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
      };
    }
  }, [dimensions]);

  // Get image dimensions on load
  const handleImageLoad = useCallback((e: Event) => {
    const img = e.target as HTMLImageElement;
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent, dragType: DragState['dragType']) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      if (!cropRegion.value) return;

      setDragState({
        isDragging: true,
        dragType,
        startX: e.clientX,
        startY: e.clientY,
        startRegion: { ...cropRegion.value },
      });
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragState.isDragging || !cropRegion.value || !containerRef.current)
        return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = dimensions.width / rect.width;
      const scaleY = dimensions.height / rect.height;

      const deltaX = (e.clientX - dragState.startX) * scaleX;
      const deltaY = (e.clientY - dragState.startY) * scaleY;

      const { startRegion, dragType } = dragState;
      let newRegion = { ...startRegion };

      const minSize = 50;

      switch (dragType) {
        case 'move':
          newRegion.x = Math.max(
            0,
            Math.min(
              dimensions.width - startRegion.width,
              startRegion.x + deltaX
            )
          );
          newRegion.y = Math.max(
            0,
            Math.min(
              dimensions.height - startRegion.height,
              startRegion.y + deltaY
            )
          );
          break;
        case 'nw':
          newRegion.x = Math.min(
            startRegion.x + startRegion.width - minSize,
            startRegion.x + deltaX
          );
          newRegion.y = Math.min(
            startRegion.y + startRegion.height - minSize,
            startRegion.y + deltaY
          );
          newRegion.width = startRegion.width - (newRegion.x - startRegion.x);
          newRegion.height = startRegion.height - (newRegion.y - startRegion.y);
          break;
        case 'ne':
          newRegion.y = Math.min(
            startRegion.y + startRegion.height - minSize,
            startRegion.y + deltaY
          );
          newRegion.width = Math.max(minSize, startRegion.width + deltaX);
          newRegion.height = startRegion.height - (newRegion.y - startRegion.y);
          break;
        case 'sw':
          newRegion.x = Math.min(
            startRegion.x + startRegion.width - minSize,
            startRegion.x + deltaX
          );
          newRegion.width = startRegion.width - (newRegion.x - startRegion.x);
          newRegion.height = Math.max(minSize, startRegion.height + deltaY);
          break;
        case 'se':
          newRegion.width = Math.max(minSize, startRegion.width + deltaX);
          newRegion.height = Math.max(minSize, startRegion.height + deltaY);
          break;
        case 'n':
          newRegion.y = Math.min(
            startRegion.y + startRegion.height - minSize,
            startRegion.y + deltaY
          );
          newRegion.height = startRegion.height - (newRegion.y - startRegion.y);
          break;
        case 's':
          newRegion.height = Math.max(minSize, startRegion.height + deltaY);
          break;
        case 'e':
          newRegion.width = Math.max(minSize, startRegion.width + deltaX);
          break;
        case 'w':
          newRegion.x = Math.min(
            startRegion.x + startRegion.width - minSize,
            startRegion.x + deltaX
          );
          newRegion.width = startRegion.width - (newRegion.x - startRegion.x);
          break;
      }

      // Clamp to bounds
      newRegion.x = Math.max(0, newRegion.x);
      newRegion.y = Math.max(0, newRegion.y);
      newRegion.width = Math.min(
        dimensions.width - newRegion.x,
        newRegion.width
      );
      newRegion.height = Math.min(
        dimensions.height - newRegion.y,
        newRegion.height
      );

      cropRegion.value = newRegion;
    },
    [dragState, dimensions]
  );

  const handlePointerUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false, dragType: null }));
  }, []);

  const handleApply = useCallback(() => {
    if (!cropRegion.value || !imageData.value) return;

    // Create canvas and crop the image
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !cropRegion.value) return;

      canvas.width = cropRegion.value.width;
      canvas.height = cropRegion.value.height;

      ctx.drawImage(
        img,
        cropRegion.value.x,
        cropRegion.value.y,
        cropRegion.value.width,
        cropRegion.value.height,
        0,
        0,
        cropRegion.value.width,
        cropRegion.value.height
      );

      const croppedData = canvas.toDataURL('image/png');
      setImage(croppedData);
      isCropping.value = false;
      cropRegion.value = null;
    };
    img.src = imageData.value;
  }, []);

  const handleCancel = useCallback(() => {
    isCropping.value = false;
    cropRegion.value = null;
  }, []);

  if (!imageData.value) return null;

  const region = cropRegion.value || {
    x: 0,
    y: 0,
    width: dimensions.width,
    height: dimensions.height,
  };
  const scaleX = containerRef.current
    ? containerRef.current.offsetWidth / dimensions.width
    : 1;
  const scaleY = containerRef.current
    ? containerRef.current.offsetHeight / dimensions.height
    : 1;

  return (
    <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8">
      {/* Crop Container */}
      <div class="relative max-w-4xl max-h-[80vh] flex flex-col gap-4">
        {/* Image Container */}
        <div
          ref={containerRef}
          class="relative overflow-hidden rounded-lg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Original Image */}
          <img
            ref={imageRef}
            src={imageData.value}
            alt="Crop preview"
            class="max-w-full max-h-[70vh] select-none"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Dark Overlay - Top */}
          <div
            class="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none"
            style={{ height: `${region.y * scaleY}px` }}
          />
          {/* Dark Overlay - Bottom */}
          <div
            class="absolute left-0 right-0 bottom-0 bg-black/60 pointer-events-none"
            style={{
              height: `${(dimensions.height - region.y - region.height) * scaleY}px`,
            }}
          />
          {/* Dark Overlay - Left */}
          <div
            class="absolute left-0 bg-black/60 pointer-events-none"
            style={{
              top: `${region.y * scaleY}px`,
              width: `${region.x * scaleX}px`,
              height: `${region.height * scaleY}px`,
            }}
          />
          {/* Dark Overlay - Right */}
          <div
            class="absolute right-0 bg-black/60 pointer-events-none"
            style={{
              top: `${region.y * scaleY}px`,
              width: `${(dimensions.width - region.x - region.width) * scaleX}px`,
              height: `${region.height * scaleY}px`,
            }}
          />

          {/* Crop Selection Area */}
          <div
            class="absolute border-2 border-white cursor-move"
            style={{
              left: `${region.x * scaleX}px`,
              top: `${region.y * scaleY}px`,
              width: `${region.width * scaleX}px`,
              height: `${region.height * scaleY}px`,
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          >
            {/* Grid Lines */}
            <div class="absolute inset-0 pointer-events-none">
              <div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
              <div class="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
              <div class="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
              <div class="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
            </div>

            {/* Corner Handles */}
            <div
              class="absolute -left-1.5 -top-1.5 w-3 h-3 bg-white rounded-sm cursor-nw-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'nw')}
            />
            <div
              class="absolute -right-1.5 -top-1.5 w-3 h-3 bg-white rounded-sm cursor-ne-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'ne')}
            />
            <div
              class="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-white rounded-sm cursor-sw-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'sw')}
            />
            <div
              class="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white rounded-sm cursor-se-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'se')}
            />

            {/* Edge Handles */}
            <div
              class="absolute left-1/2 -translate-x-1/2 -top-1.5 w-6 h-3 bg-white rounded-sm cursor-n-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'n')}
            />
            <div
              class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-6 h-3 bg-white rounded-sm cursor-s-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 's')}
            />
            <div
              class="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-6 bg-white rounded-sm cursor-w-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'w')}
            />
            <div
              class="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-6 bg-white rounded-sm cursor-e-resize shadow-md"
              onPointerDown={(e) => handlePointerDown(e, 'e')}
            />
          </div>

          {/* Size indicator */}
          <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white font-mono">
            {Math.round(region.width)} × {Math.round(region.height)}
          </div>
        </div>

        {/* Action Buttons */}
        <div class="flex justify-center gap-3">
          <button
            onClick={handleCancel}
            class="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            class="px-6 py-2.5 bg-banana hover:bg-banana-dark text-zinc-900 rounded-lg font-medium transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
