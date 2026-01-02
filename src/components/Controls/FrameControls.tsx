import {
  padding,
  borderRadius,
  shadow,
  shadowColor,
  inset,
  insetColor,
  rotate,
} from '../../store/editor';
import { Joystick } from './Joystick';
import { FramePicker } from './FramePicker';
import { Slider, CompactSlider } from '../ui/Slider';

// Inset color swatch with link icon
function InsetSwatch({
  color,
  onChange,
}: {
  color: string;
  onChange: (c: string) => void;
}) {
  return (
    <label class="relative cursor-pointer group shrink-0">
      <div class="relative">
        <div
          class="w-10 h-10 rounded-xl shadow-sm border border-zinc-200
						transition-all duration-150
						group-hover:scale-105 group-hover:border-zinc-300"
          style={{ backgroundColor: color }}
        />
        {/* Link icon overlay */}
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-sm border border-zinc-200 flex items-center justify-center">
          <svg
            class="w-2.5 h-2.5 text-zinc-400"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M6 10l4-4M8.5 4.5L11 2a2.12 2.12 0 013 3l-2.5 2.5M7.5 11.5L5 14a2.12 2.12 0 01-3-3l2.5-2.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        class="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>
  );
}

// Shadow color swatch - same style as Inset
function ShadowSwatch({
  color,
  onChange,
}: {
  color: string;
  onChange: (c: string) => void;
}) {
  return (
    <label class="relative cursor-pointer group shrink-0">
      <div class="relative">
        <div
          class="w-10 h-10 rounded-xl shadow-sm border border-zinc-200
						transition-all duration-150
						group-hover:scale-105 group-hover:border-zinc-300"
          style={{ backgroundColor: color }}
        />
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        class="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>
  );
}

export function FrameControls() {
  return (
    <div class="flex flex-col">
      {/* Frame Picker */}
      <FramePicker />

      {/* Size / Padding */}
      <Slider
        label="Size"
        value={padding.value}
        min={16}
        max={128}
        step={4}
        onChange={(v) => (padding.value = v)}
      />

      {/* Roundness */}
      <Slider
        label="Roundness"
        value={borderRadius.value}
        min={0}
        max={32}
        onChange={(v) => (borderRadius.value = v)}
      />

      {/* Shadow - Row with swatch + slider (same style as Inset) */}
      <div class="flex items-center gap-3 py-3 border-b border-zinc-100/80">
        <span class="text-[13px] font-medium text-zinc-700">Shadow</span>
        <ShadowSwatch
          color={shadowColor.value}
          onChange={(c) => (shadowColor.value = c)}
        />
        <div class="flex-1">
          <CompactSlider
            value={shadow.value}
            min={0}
            max={10}
            onChange={(v) => (shadow.value = v)}
          />
        </div>
      </div>

      {/* Inset - Row with swatch + slider */}
      <div class="flex items-center gap-3 py-3 border-b border-zinc-100/80">
        <span class="text-[13px] font-medium text-zinc-700">Inset</span>
        <InsetSwatch
          color={insetColor.value}
          onChange={(c) => (insetColor.value = c)}
        />
        <div class="flex-1">
          <CompactSlider
            value={inset.value}
            min={0}
            max={20}
            onChange={(v) => (inset.value = v)}
          />
        </div>
      </div>

      {/* Rotate */}
      <Slider
        label="Rotate"
        value={rotate.value}
        min={-180}
        max={180}
        unit="°"
        onChange={(v) => (rotate.value = v)}
      />

      {/* Tilt Joystick */}
      <div class="py-3 border-b border-zinc-100/80">
        <Joystick size={80} maxValue={20} />
      </div>
    </div>
  );
}
