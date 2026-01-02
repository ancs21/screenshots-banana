import { signal, computed } from '@preact/signals';
import type { PatternType } from '../lib/patterns';

// Image state
export const imageData = signal<string | null>(null);
export const imageName = signal<string>('screenshot');

// Frame controls (screenshot)
export const padding = signal(64);
export const borderRadius = signal(16); // Screenshot roundness
export const shadow = signal(3);
export const shadowColor = signal('#000000');
export const inset = signal(0);
export const insetColor = signal('#f87171'); // Red accent like Pika
export const rotate = signal(0); // rotateZ - flat 2D rotation
export const tiltX = signal(0); // rotateX - 3D tilt forward/back
export const tiltY = signal(0); // rotateY - 3D tilt left/right

// Crop state
export const isCropping = signal(false);
export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const cropRegion = signal<CropRegion | null>(null);

// Browser frame style
export type FrameStyle =
  | 'none'
  | 'arc'
  | 'stack-light'
  | 'stack-dark'
  | 'macos-light'
  | 'macos-dark'
  | 'macos-subtle'
  | 'macos-adaptive'
  | 'eclipse'
  | 'silver-back'
  | 'shadow-back'
  | 'windows-light'
  | 'windows-dark'
  | 'shortboard'
  | 'ruler'
  | 'emotion';
export const frameStyle = signal<FrameStyle>('none');

// Background
export const backgroundType = signal<'gradient' | 'pattern' | 'image' | 'ai'>(
  'gradient'
);
export const gradientIndex = signal(0);
export const patternType = signal<PatternType>('none');
export const customBackground = signal<string | null>(null);
export const noiseOpacity = signal(0); // 0-20%

// AI Background
export const aiPrompt = signal<string>('');
export const aiGenerating = signal(false);
export const aiBackground = signal<string | null>(null);

// Canvas settings
export const canvasRadius = signal(16); // Canvas/background roundness

// Canvas size presets
export type CanvasPreset =
  | 'auto'
  | 'free'
  | 'tweet'
  | 'instagram'
  | 'instagram-story'
  | 'appstore';
export const canvasPreset = signal<CanvasPreset>('auto');

// Custom canvas dimensions
export const canvasWidth = signal<number>(1200);
export const canvasHeight = signal<number>(800);

export const canvasSizes: Record<
  Exclude<CanvasPreset, 'free'>,
  { width: number; height: number } | null
> = {
  auto: null,
  tweet: { width: 1200, height: 675 },
  instagram: { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  appstore: { width: 1284, height: 2778 },
};

// Get current canvas size (returns custom dimensions or preset size)
export function getCanvasSize(): { width: number; height: number } | null {
  if (canvasPreset.value === 'free') {
    return { width: canvasWidth.value, height: canvasHeight.value };
  }
  return canvasSizes[canvasPreset.value];
}

// Export settings
export const exportScale = signal<1 | 2 | 3>(2);

// Computed: has image loaded
export const hasImage = computed(() => imageData.value !== null);

// Actions
export function setImage(data: string, name?: string) {
  imageData.value = data;
  if (name) {
    imageName.value = name.replace(/\.[^/.]+$/, ''); // Remove extension
  }
}

export function clearImage() {
  imageData.value = null;
  imageName.value = 'screenshot';
}

export function resetControls() {
  padding.value = 64;
  borderRadius.value = 16;
  canvasRadius.value = 16;
  shadow.value = 3;
  inset.value = 0;
  rotate.value = 0;
  tiltX.value = 0;
  tiltY.value = 0;
  frameStyle.value = 'none';
  noiseOpacity.value = 0;
  patternType.value = 'none';
}
