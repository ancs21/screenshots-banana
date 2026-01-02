import { useState, useEffect } from 'preact/hooks';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { imageName, exportScale } from '../../store/editor';
import { getCanvasElement } from '../Editor/Canvas';
import { Popover } from '@base-ui-components/react/popover';
import { addAIPreset } from '../../store/ai';

type ExportFormat = 'png' | 'jpg' | 'svg' | 'webp';

interface ExportOptions {
  format: ExportFormat;
  withBackground?: boolean;
}

async function exportImage(
  options: ExportOptions = { format: 'png', withBackground: true }
): Promise<string | null> {
  const element = getCanvasElement();
  if (!element) return null;

  const { format, withBackground = true } = options;

  try {
    const commonOptions = {
      pixelRatio: exportScale.value,
      cacheBust: true,
      backgroundColor: withBackground ? undefined : 'transparent',
    };

    let dataUrl: string;

    switch (format) {
      case 'jpg':
        dataUrl = await toJpeg(element, { ...commonOptions, quality: 0.92 });
        break;
      case 'svg':
        dataUrl = await toSvg(element, commonOptions);
        break;
      case 'webp':
        // Convert PNG to WebP via canvas
        const pngUrl = await toPng(element, commonOptions);
        dataUrl = await convertToWebP(pngUrl);
        break;
      case 'png':
      default:
        dataUrl = await toPng(element, commonOptions);
        break;
    }

    return dataUrl;
  } catch (error) {
    console.error('Export failed:', error);
    return null;
  }
}

async function convertToWebP(pngDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/webp', 0.92));
    };
    img.onerror = reject;
    img.src = pngDataUrl;
  });
}

// Copy icon
function CopyIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

// Save/Download icon
function SaveIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

// Checkmark icon
function CheckIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Chevron down icon
function ChevronDownIcon() {
  return (
    <svg
      class="w-3 h-3"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6l4 4 4-4" />
    </svg>
  );
}

// Preset/Bookmark icon
function PresetIcon() {
  return (
    <svg
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  );
}

const formatOptions: {
  format: ExportFormat;
  label: string;
  ext: string;
  shortcut: string;
}[] = [
  { format: 'png', label: 'as PNG', ext: 'png', shortcut: 'S' },
  { format: 'jpg', label: 'as JPG', ext: 'jpg', shortcut: 'J' },
  { format: 'svg', label: 'as SVG', ext: 'svg', shortcut: 'G' },
  { format: 'webp', label: 'as WebP', ext: 'webp', shortcut: 'I' },
];

export function ExportButtons() {
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPreset, setSavingPreset] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  const isMac =
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const handleCopy = async () => {
    setCopying(true);
    const dataUrl = await exportImage({ format: 'png' });
    if (!dataUrl) {
      setCopying(false);
      return;
    }

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setTimeout(() => setCopying(false), 1000);
    } catch (error) {
      console.error('Copy failed:', error);
      setCopying(false);
    }
  };

  const handleDownload = async (
    format: ExportFormat,
    withBackground = true
  ) => {
    setSaving(true);
    setSaveMenuOpen(false);

    const dataUrl = await exportImage({ format, withBackground });
    if (!dataUrl) {
      setSaving(false);
      return;
    }

    const ext = format === 'jpg' ? 'jpg' : format;
    const suffix = withBackground ? '' : '-transparent';
    const link = document.createElement('a');
    link.download = `${imageName.value}-banana${suffix}.${ext}`;
    link.href = dataUrl;
    link.click();
    setTimeout(() => setSaving(false), 1000);
  };

  const handleSaveToPresets = async () => {
    setSavingPreset(true);
    const dataUrl = await exportImage({ format: 'png' });
    if (!dataUrl) {
      setSavingPreset(false);
      return;
    }

    try {
      await addAIPreset(imageName.value, 'Saved screenshot', dataUrl, 'other');
      setTimeout(() => setSavingPreset(false), 1500);
    } catch (error) {
      console.error('Save to presets failed:', error);
      setSavingPreset(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const key = e.key.toUpperCase();
      const format = formatOptions.find((f) => f.shortcut === key);

      if (format) {
        e.preventDefault();
        handleDownload(format.format);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scaleOptions = [
    { value: 1, label: '1x', sublabel: 'Standard' },
    { value: 2, label: '2x', sublabel: 'HD' },
    { value: 3, label: '3x', sublabel: 'Ultra' },
  ];

  const currentScale =
    scaleOptions.find((s) => s.value === exportScale.value) || scaleOptions[1];

  return (
    <div class="flex items-center gap-2">
      {/* Scale Selector */}
      <Popover.Root open={scaleOpen} onOpenChange={setScaleOpen}>
        <Popover.Trigger
          class="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium
						bg-zinc-100 border border-zinc-200 rounded-lg
						hover:bg-zinc-200 hover:border-zinc-300
						transition-all duration-150 text-zinc-700"
        >
          <span class="tabular-nums">{currentScale.label}</span>
          <ChevronDownIcon />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="top" sideOffset={8} className="z-50">
            <Popover.Popup class="bg-white rounded-lg shadow-lg border border-zinc-200 p-1 min-w-[120px]">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    exportScale.value = option.value;
                    setScaleOpen(false);
                  }}
                  class={`flex items-center justify-between w-full px-3 py-2 rounded-md text-[13px] transition-colors
										${
                      exportScale.value === option.value
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                >
                  <span class="font-medium">{option.label}</span>
                  <span class="text-[11px] text-zinc-400">
                    {option.sublabel}
                  </span>
                </button>
              ))}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {/* Save to Presets Button */}
      <button
        onClick={handleSaveToPresets}
        disabled={savingPreset}
        data-action="preset"
        class={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium
					border rounded-lg transition-all duration-150
					${
            savingPreset
              ? 'bg-violet-50 border-violet-200 text-violet-600'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:border-zinc-300'
          }`}
      >
        {savingPreset ? <CheckIcon /> : <PresetIcon />}
      </button>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        disabled={copying}
        class={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-medium
					border rounded-lg transition-all duration-150
					${
            copying
              ? 'bg-green-50 border-green-200 text-green-600'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:border-zinc-300'
          }`}
      >
        {copying ? <CheckIcon /> : <CopyIcon />}
        <span>{copying ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Save Button with Dropdown */}
      <Popover.Root open={saveMenuOpen} onOpenChange={setSaveMenuOpen}>
        <div class="flex">
          <button
            onClick={() => handleDownload('png')}
            disabled={saving}
            class={`flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-medium
							border border-r-0 rounded-l-lg transition-all duration-150
							${
                saving
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:border-zinc-300'
              }`}
          >
            {saving ? <CheckIcon /> : <SaveIcon />}
            <span>{saving ? 'Saved!' : 'Save'}</span>
          </button>
          <Popover.Trigger
            class="flex items-center justify-center px-2 py-2.5
							bg-zinc-100 border border-zinc-200 rounded-r-lg
							hover:bg-zinc-200 hover:border-zinc-300
							transition-all duration-150 text-zinc-700"
          >
            <ChevronDownIcon />
          </Popover.Trigger>
        </div>
        <Popover.Portal>
          <Popover.Positioner
            side="top"
            sideOffset={8}
            align="end"
            className="z-50"
          >
            <Popover.Popup class="bg-white rounded-xl shadow-lg border border-zinc-200 py-2 min-w-[200px]">
              {formatOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => handleDownload(option.format)}
                  class="flex items-center justify-between w-full px-4 py-2.5 text-[14px] transition-colors
										text-zinc-700 hover:bg-zinc-50"
                >
                  <span>{option.label}</span>
                  <span class="flex items-center gap-1">
                    <kbd class="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-[11px] text-zinc-500 font-medium">
                      {isMac ? '⌘' : 'Ctrl'}
                    </kbd>
                    <kbd class="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-[11px] text-zinc-500 font-medium">
                      {option.shortcut}
                    </kbd>
                  </span>
                </button>
              ))}

              <div class="border-t border-zinc-100 my-1" />

              <button
                onClick={() => handleDownload('png', false)}
                class="flex items-center w-full px-4 py-2.5 text-[14px] transition-colors
									text-zinc-700 hover:bg-zinc-50"
              >
                <span>without background</span>
              </button>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
