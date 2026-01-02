// SVG pattern definitions
export type PatternType = 'waves' | 'dots' | 'grid' | 'diagonal' | 'none';

export const patterns: Record<PatternType, string> = {
	none: '',

	waves: `<svg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"/>
	</svg>`,

	dots: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		<circle cx="10" cy="10" r="1.5" fill="currentColor" fill-opacity="0.15"/>
	</svg>`,

	grid: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		<path d="M20 0 L20 20 M0 20 L20 20" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="0.5"/>
	</svg>`,

	diagonal: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 20 L20 0" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="0.5"/>
	</svg>`,
};

export function getPatternDataURL(type: PatternType): string {
	if (type === 'none' || !patterns[type]) return '';
	const svg = patterns[type];
	const encoded = encodeURIComponent(svg);
	return `url("data:image/svg+xml,${encoded}")`;
}

export function getPatternStyle(type: PatternType): string {
	const dataUrl = getPatternDataURL(type);
	if (!dataUrl) return '';
	return dataUrl;
}
