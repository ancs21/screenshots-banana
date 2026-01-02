// Curated gradient presets inspired by Pika.style
export const gradients = [
  // Warm
  { name: 'Sunset', colors: ['#f97316', '#ec4899'], angle: 135 },
  { name: 'Peach', colors: ['#fbbf24', '#f472b6'], angle: 135 },
  { name: 'Fire', colors: ['#ef4444', '#f97316'], angle: 135 },

  // Cool
  { name: 'Ocean', colors: ['#06b6d4', '#3b82f6'], angle: 135 },
  { name: 'Purple Haze', colors: ['#8b5cf6', '#ec4899'], angle: 135 },
  { name: 'Mint', colors: ['#10b981', '#06b6d4'], angle: 135 },

  // Dark
  { name: 'Midnight', colors: ['#1e1b4b', '#312e81'], angle: 135 },
  { name: 'Slate', colors: ['#334155', '#1e293b'], angle: 135 },
  { name: 'Charcoal', colors: ['#18181b', '#3f3f46'], angle: 135 },

  // Vibrant
  { name: 'Rainbow', colors: ['#ec4899', '#8b5cf6', '#3b82f6'], angle: 90 },
  { name: 'Aurora', colors: ['#22d3ee', '#a855f7', '#ec4899'], angle: 135 },
  { name: 'Banana', colors: ['#fbbf24', '#f59e0b'], angle: 135 },
];

export function getGradientCSS(index: number): string {
  const gradient = gradients[index] ?? gradients[0];
  const colorStops = gradient.colors.join(', ');
  return `linear-gradient(${gradient.angle}deg, ${colorStops})`;
}

export function getGradientStyle(index: number): { background: string } {
  return { background: getGradientCSS(index) };
}
