import { useEffect, useState } from 'preact/hooks';
import {
  aiPresets,
  loadAIPresets,
  removeAIPreset,
  presetsLoading,
} from '../../store/ai';
import { backgroundType, aiBackground } from '../../store/editor';

// Preset card with refined hover effects
function PresetCard({
  preset,
  onApply,
  onDelete,
}: {
  preset: {
    id: string;
    name: string;
    prompt: string;
    imageData: string;
    type: string;
  };
  onApply: () => void;
  onDelete: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
  };

  const typeConfig = {
    background: { label: 'BG', gradient: 'from-violet-500 to-purple-600' },
    ui: { label: 'UI', gradient: 'from-blue-500 to-cyan-500' },
    other: { label: 'AI', gradient: 'from-zinc-500 to-zinc-600' },
  }[preset.type] || { label: 'AI', gradient: 'from-zinc-500 to-zinc-600' };

  return (
    <div
      class={`relative rounded-xl overflow-hidden bg-zinc-100 transition-all duration-300
				${isDeleting ? 'opacity-50 scale-95' : ''}
				${isHovered ? 'shadow-lg shadow-zinc-200 scale-[1.02]' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div class="aspect-square">
        <img
          src={preset.imageData}
          alt={preset.name}
          class="w-full h-full object-cover"
        />
      </div>

      {/* Type badge */}
      <div class="absolute top-2 left-2">
        <span
          class={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider
					bg-gradient-to-r ${typeConfig.gradient} text-white shadow-sm`}
        >
          {typeConfig.label}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        class={`absolute inset-0 transition-all duration-200
				${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Gradient overlay */}
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div class="absolute inset-0 flex flex-col justify-end p-3">
          {/* Name */}
          <p
            class="text-[11px] text-white font-medium mb-2 truncate"
            title={preset.prompt}
          >
            {preset.name}
          </p>

          {/* Actions */}
          <div class="flex gap-1.5">
            <button
              onClick={onApply}
              class="flex-1 px-2 py-1.5 bg-white text-zinc-900 text-[10px] font-semibold rounded-lg
								hover:bg-zinc-100 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              class="px-2 py-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg
								hover:bg-red-500/80 transition-all border border-white/20"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIPresets() {
  // Load presets on mount
  useEffect(() => {
    loadAIPresets();
  }, []);

  const handleApply = (imageData: string) => {
    aiBackground.value = imageData;
    backgroundType.value = 'ai';
  };

  const handleDelete = async (id: string) => {
    await removeAIPreset(id);
  };

  // Loading state
  if (presetsLoading.value) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center p-8">
        <div class="w-8 h-8 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mb-3" />
        <p class="text-sm text-zinc-500 font-medium">Loading presets...</p>
      </div>
    );
  }

  // Empty state
  if (aiPresets.value.length === 0) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50">
        {/* Illustration */}
        <div class="relative mb-6">
          <div
            class="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200
						flex items-center justify-center shadow-inner"
          >
            <svg
              class="w-10 h-10 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 16l5-5 4 4 5-5 4 4" />
              <circle cx="9" cy="9" r="2" />
            </svg>
          </div>
          {/* Decorative elements */}
          <div class="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 opacity-60" />
          <div class="absolute -bottom-1 -left-1 w-4 h-4 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 opacity-50" />
        </div>

        <h3 class="text-base font-bold text-zinc-800 mb-1">No presets yet</h3>
        <p class="text-sm text-zinc-500 max-w-[200px] leading-relaxed">
          Generate images in the AI tab and save them as presets for quick
          reuse.
        </p>

        {/* Hint */}
        <div class="mt-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-zinc-200 shadow-sm">
          <svg
            class="w-4 h-4 text-violet-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="text-xs text-zinc-600">
            Switch to the <strong>AI</strong> tab to get started
          </span>
        </div>
      </div>
    );
  }

  // Presets grid
  return (
    <div class="flex-1 flex flex-col overflow-hidden bg-zinc-50/50">
      {/* Header */}
      <div class="px-4 py-3 bg-white border-b border-zinc-100">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-zinc-800">Saved Presets</h3>
            <p class="text-[11px] text-zinc-500">
              {aiPresets.value.length} item
              {aiPresets.value.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div class="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div class="grid grid-cols-2 gap-2">
          {aiPresets.value.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onApply={() => handleApply(preset.imageData)}
              onDelete={() => handleDelete(preset.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
