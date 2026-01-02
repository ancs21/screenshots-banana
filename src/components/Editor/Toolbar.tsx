import { useCallback } from 'preact/hooks';
import { isCropping, resetControls, setImage } from '../../store/editor';

// Icon components
function CropIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7 7V3M7 7H3M7 7L21 21M17 17H21M17 17V21M17 17L3 3"
      />
    </svg>
  );
}

function ReplaceIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

interface ToolbarButtonProps {
  icon: preact.ComponentChildren;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  active = false,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      class={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150
				${
          active
            ? 'bg-zinc-100 text-zinc-900'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function Toolbar() {
  const handleCrop = useCallback(() => {
    isCropping.value = !isCropping.value;
  }, []);

  const handleReplace = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          setImage(data, file.name);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const handleReset = useCallback(() => {
    resetControls();
  }, []);

  return (
    <div class="relative flex justify-center mb-4">
      {/* Toolbar Container */}
      <div class="relative">
        {/* Main Toolbar */}
        <div class="flex items-center bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden">
          <ToolbarButton
            icon={<CropIcon />}
            label="Crop"
            onClick={handleCrop}
            active={isCropping.value}
          />
          <div class="w-px h-6 bg-zinc-200" />
          <ToolbarButton
            icon={<ReplaceIcon />}
            label="Replace screenshot"
            onClick={handleReplace}
          />
          <div class="w-px h-6 bg-zinc-200" />
          <ToolbarButton
            icon={<ResetIcon />}
            label="Reset canvas"
            onClick={handleReset}
          />
        </div>

        {/* Arrow pointing down */}
        <div class="absolute left-1/2 -translate-x-1/2 -bottom-2">
          <div class="w-4 h-4 bg-white border-r border-b border-zinc-200 rotate-45 transform" />
        </div>
      </div>
    </div>
  );
}
