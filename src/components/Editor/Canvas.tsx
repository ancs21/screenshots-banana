import { useRef } from 'preact/hooks';
import {
	imageData,
	padding,
	borderRadius,
	canvasRadius,
	shadow,
	inset,
	insetColor,
	rotate,
	tiltX,
	tiltY,
	gradientIndex,
	backgroundType,
	patternType,
	noiseOpacity,
	frameStyle,
	getCanvasSize,
	aiBackground,
	isCropping,
} from '../../store/editor';
import { getGradientCSS } from '../../lib/gradients';
import { getPatternStyle } from '../../lib/patterns';
import { Frame } from './Frame';
import { Toolbar } from './Toolbar';
import { CropOverlay } from './CropOverlay';

export function Canvas() {
	const canvasRef = useRef<HTMLDivElement>(null);

	if (!imageData.value) return null;

	const shadowValue = shadow.value;
	const shadowCSS =
		shadowValue > 0
			? `0 ${shadowValue * 4}px ${shadowValue * 8}px rgba(0,0,0,${0.1 + shadowValue * 0.05}),
			   0 ${shadowValue * 2}px ${shadowValue * 4}px rgba(0,0,0,${0.1 + shadowValue * 0.03})`
			: 'none';

	const transformCSS = `
		perspective(1000px)
		rotateZ(${rotate.value}deg)
		rotateX(${tiltX.value}deg)
		rotateY(${tiltY.value}deg)
	`;

	// Background - gradient, AI, or solid
	let backgroundCSS = '#27272a';
	if (backgroundType.value === 'ai' && aiBackground.value) {
		backgroundCSS = `url(${aiBackground.value}) center/cover`;
	} else if (backgroundType.value === 'gradient') {
		backgroundCSS = getGradientCSS(gradientIndex.value);
	}

	// Pattern overlay
	const patternCSS = getPatternStyle(patternType.value);

	// Canvas size
	const size = getCanvasSize();
	const canvasStyle: Record<string, string | number> = {
		background: backgroundCSS,
		padding: `${padding.value}px`,
		borderRadius: `${canvasRadius.value}px`,
	};

	if (size) {
		// Scale down for preview but maintain aspect ratio
		const scale = Math.min(600 / size.width, 400 / size.height, 1);
		canvasStyle.width = `${size.width * scale}px`;
		canvasStyle.height = `${size.height * scale}px`;
		canvasStyle.display = 'flex';
		canvasStyle.alignItems = 'center';
		canvasStyle.justifyContent = 'center';
	}

	// When using a frame, don't apply border radius to image - frame handles it
	const hasFrame = frameStyle.value !== 'none';

	// Inset creates a colored border around the image
	const insetValue = inset.value;
	const insetCSS = insetValue > 0 ? `0 0 0 ${insetValue}px ${insetColor.value}` : undefined;

	const imageElement = (
		<img
			src={imageData.value}
			alt="Screenshot"
			class="max-w-full h-auto block transition-all duration-200"
			style={{
				borderRadius: hasFrame ? undefined : `${borderRadius.value}px`,
				boxShadow: hasFrame ? undefined : [shadowCSS, insetCSS].filter(Boolean).join(', ') || undefined,
				maxHeight: size ? '80%' : undefined,
			}}
		/>
	);

	return (
		<>
			<div class="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
				{/* Floating Toolbar */}
				<Toolbar />

				{/* Canvas */}
				<div
					ref={canvasRef}
					id="export-canvas"
					class="relative transition-all duration-200"
					style={canvasStyle}
				>
					{/* Pattern overlay */}
					{patternCSS && (
						<div
							class="absolute inset-0 pointer-events-none"
							style={{
								backgroundImage: patternCSS,
								backgroundRepeat: 'repeat',
								borderRadius: `${canvasRadius.value}px`,
							}}
						/>
					)}

					{/* Noise overlay */}
					{noiseOpacity.value > 0 && (
						<div
							class="absolute inset-0 pointer-events-none"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
								opacity: noiseOpacity.value / 100,
								borderRadius: `${canvasRadius.value}px`,
							}}
						/>
					)}

					{/* Content with optional frame */}
					<div
						class="relative z-10 transition-transform duration-200"
						style={{
							transform: transformCSS,
							boxShadow: hasFrame ? [shadowCSS, insetCSS].filter(Boolean).join(', ') || undefined : undefined,
							borderRadius: hasFrame ? `${borderRadius.value}px` : undefined,
						}}
					>
						{frameStyle.value !== 'none' ? (
							<Frame>{imageElement}</Frame>
						) : (
							imageElement
						)}
					</div>
				</div>
			</div>

			{/* Crop Overlay Modal */}
			{isCropping.value && <CropOverlay />}
		</>
	);
}

// Export the canvas ref for html-to-image
export function getCanvasElement(): HTMLElement | null {
	return document.getElementById('export-canvas');
}
