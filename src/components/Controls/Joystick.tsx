import { useRef, useState, useCallback } from 'preact/hooks';
import { tiltX, tiltY } from '../../store/editor';
import { Tooltip } from '../ui/Tooltip';

interface JoystickProps {
  size?: number;
  maxValue?: number;
}

export function Joystick({ size = 80, maxValue = 15 }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate handle position from current values
  const handleX = (tiltY.value / maxValue) * (size / 2 - 10);
  const handleY = (tiltX.value / maxValue) * (size / 2 - 10);

  const updateValues = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center
      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      // Constrain to circle
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = size / 2 - 10;

      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      // Map to -maxValue to maxValue
      const newTiltY = Math.round((deltaX / maxDistance) * maxValue);
      const newTiltX = Math.round((deltaY / maxDistance) * maxValue);

      tiltY.value = Math.max(-maxValue, Math.min(maxValue, newTiltY));
      tiltX.value = Math.max(-maxValue, Math.min(maxValue, newTiltX));
    },
    [size, maxValue]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateValues(e.clientX, e.clientY);
    },
    [updateValues]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      updateValues(e.clientX, e.clientY);
    },
    [isDragging, updateValues]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    tiltX.value = 0;
    tiltY.value = 0;
  }, []);

  const isActive = tiltX.value !== 0 || tiltY.value !== 0;

  return (
    <div class="flex flex-col gap-2">
      {/* Header with label, help, and reset */}
      <div class="flex items-center gap-2">
        <span class="text-[13px] font-medium text-zinc-700">Tilt</span>
        <Tooltip content="Drag to tilt the screenshot in 3D">
          <button class="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-400 flex items-center justify-center transition-colors hover:bg-zinc-200 hover:text-zinc-500">
            ?
          </button>
        </Tooltip>
        <button
          onClick={handleReset}
          disabled={!isActive}
          class={`px-2 py-0.5 text-[11px] font-medium rounded-md border transition-all duration-150
						${
              isActive
                ? 'text-zinc-600 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'
                : 'text-zinc-300 bg-zinc-50 border-zinc-100 cursor-default'
            }`}
        >
          Reset
        </button>
      </div>

      {/* Joystick Container */}
      <div
        ref={containerRef}
        class="relative rounded-full bg-zinc-100 border border-zinc-200 cursor-pointer select-none touch-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Crosshair guides */}
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="absolute w-full h-px bg-zinc-200" />
          <div class="absolute h-full w-px bg-zinc-200" />
        </div>

        {/* Handle - dark pill */}
        <div
          class={`absolute w-5 h-5 rounded-full transition-all duration-75 border-2
						${
              isDragging
                ? 'bg-zinc-800 border-zinc-600 scale-110'
                : 'bg-zinc-600 border-zinc-500 hover:bg-zinc-700'
            }`}
          style={{
            left: `calc(50% - 10px + ${handleX}px)`,
            top: `calc(50% - 10px + ${handleY}px)`,
            transition: isDragging
              ? 'none'
              : 'left 0.1s, top 0.1s, transform 0.1s, background-color 0.1s',
          }}
        />
      </div>
    </div>
  );
}
