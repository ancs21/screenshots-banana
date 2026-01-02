import { useCallback, useState, useEffect } from 'preact/hooks';
import { setImage, hasImage } from '../../store/editor';

// Demo image - a sample screenshot for users to try
const DEMO_IMAGE = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80';

export function DropZone() {
	const [isDragging, setIsDragging] = useState(false);
	const [isLoadingDemo, setIsLoadingDemo] = useState(false);

	const handleFile = useCallback((file: File) => {
		if (!file.type.startsWith('image/')) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target?.result as string;
			setImage(data, file.name);
		};
		reader.readAsDataURL(file);
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const file = e.dataTransfer?.files[0];
			if (file) handleFile(file);
		},
		[handleFile]
	);

	const handleDragOver = useCallback((e: DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handlePaste = useCallback(
		(e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			for (const item of items) {
				if (item.type.startsWith('image/')) {
					const file = item.getAsFile();
					if (file) handleFile(file);
					break;
				}
			}
		},
		[handleFile]
	);

	const handleClick = useCallback(() => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) handleFile(file);
		};
		input.click();
	}, [handleFile]);

	const handleTryDemo = useCallback(async () => {
		setIsLoadingDemo(true);
		try {
			const response = await fetch(DEMO_IMAGE);
			const blob = await response.blob();
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target?.result as string;
				setImage(data, 'demo-screenshot');
			};
			reader.readAsDataURL(blob);
		} catch (err) {
			console.error('Failed to load demo image:', err);
		} finally {
			setIsLoadingDemo(false);
		}
	}, []);

	// Listen for paste events globally
	useEffect(() => {
		window.addEventListener('paste', handlePaste as EventListener);
		return () => window.removeEventListener('paste', handlePaste as EventListener);
	}, [handlePaste]);

	if (hasImage.value) return null;

	const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

	return (
		<div class="relative w-full h-full overflow-hidden">
			{/* Animated gradient background */}
			<div class="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
				{/* Floating organic blobs */}
				<div class="absolute top-[-10%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px]
					rounded-[40%_60%_70%_30%/40%_50%_60%_50%]
					bg-gradient-to-br from-amber-200/60 to-orange-300/40
					blur-3xl animate-[blobFloat1_20s_ease-in-out_infinite]" />
				<div class="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px]
					rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
					bg-gradient-to-tr from-rose-200/50 to-pink-300/30
					blur-3xl animate-[blobFloat2_25s_ease-in-out_infinite]" />
				<div class="absolute top-[40%] left-[60%] w-[25vw] h-[25vw] max-w-[300px] max-h-[300px]
					rounded-[50%_50%_45%_55%/55%_45%_55%_45%]
					bg-gradient-to-bl from-yellow-200/40 to-amber-200/30
					blur-2xl animate-[blobFloat3_18s_ease-in-out_infinite]" />

				{/* Subtle noise texture overlay */}
				<div class="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			{/* Main content */}
			<div class="relative z-10 w-full h-full flex items-center justify-center p-8">
				{/* Card container */}
				<div
					class={`
						w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-3xl
						shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
						border border-white/50
						transition-all duration-300 ease-out
						${isDragging ? 'scale-[1.02] shadow-[0_25px_70px_-15px_rgba(251,191,36,0.4)]' : ''}
					`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					{/* Top section - Drop zone hint */}
					<div class="px-8 pt-8 pb-6 text-center border-b border-zinc-100">
						<p class="text-zinc-500 text-sm mb-2">
							Drag-n-drop your image here,
						</p>
						<p class="text-zinc-400 text-sm flex items-center justify-center gap-2 flex-wrap">
							<span>use</span>
							<kbd class="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-xs text-zinc-600 font-medium shadow-sm">
								{isMac ? '⌘' : 'Ctrl'}+V
							</kbd>
							<span>to paste from clipboard</span>
						</p>
					</div>

					{/* Action buttons section */}
					<div class="p-8">
						<div class="grid grid-cols-2 gap-4 mb-6">
							{/* Add your image button */}
							<button
								onClick={handleClick}
								class="group relative flex flex-col items-center gap-3 p-6 rounded-2xl
									bg-gradient-to-b from-zinc-50 to-zinc-100/50
									border-2 border-dashed border-zinc-200
									hover:border-amber-300 hover:from-amber-50/50 hover:to-amber-100/30
									transition-all duration-200"
							>
								<div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-100
									flex items-center justify-center
									group-hover:shadow-md group-hover:border-amber-200 group-hover:scale-105
									transition-all duration-200">
									<svg class="w-6 h-6 text-zinc-400 group-hover:text-amber-500 transition-colors"
										viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
									</svg>
								</div>
								<span class="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
									Add your image
								</span>
							</button>

							{/* Try demo button */}
							<button
								onClick={handleTryDemo}
								disabled={isLoadingDemo}
								class="group relative flex flex-col items-center gap-3 p-6 rounded-2xl
									bg-gradient-to-b from-zinc-50 to-zinc-100/50
									border-2 border-dashed border-zinc-200
									hover:border-rose-300 hover:from-rose-50/50 hover:to-rose-100/30
									disabled:opacity-60 disabled:cursor-wait
									transition-all duration-200"
							>
								<div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-100
									flex items-center justify-center
									group-hover:shadow-md group-hover:border-rose-200 group-hover:scale-105
									transition-all duration-200">
									{isLoadingDemo ? (
										<div class="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
									) : (
										<svg class="w-6 h-6 text-zinc-400 group-hover:text-rose-500 transition-colors"
											viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
										</svg>
									)}
								</div>
								<span class="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
									{isLoadingDemo ? 'Loading...' : 'Try demo image'}
								</span>
							</button>
						</div>

						{/* Drag active state overlay */}
						{isDragging && (
							<div class="absolute inset-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/80 backdrop-blur-sm
								flex items-center justify-center z-20 pointer-events-none animate-[fadeIn_0.15s_ease-out]">
								<div class="text-center">
									<div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100
										flex items-center justify-center animate-[bounce_1s_ease-in-out_infinite]">
										<svg class="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
										</svg>
									</div>
									<p class="text-amber-700 font-semibold">Drop your image here</p>
								</div>
							</div>
						)}
					</div>

					{/* Footer hint */}
					<div class="px-8 pb-6 text-center">
						<p class="text-xs text-zinc-400">
							Supports PNG, JPG, WebP, and GIF
						</p>
					</div>
				</div>
			</div>

			{/* Keyframe animations */}
			<style>{`
				@keyframes blobFloat1 {
					0%, 100% {
						transform: translate(0, 0) rotate(0deg) scale(1);
					}
					33% {
						transform: translate(30px, -50px) rotate(10deg) scale(1.05);
					}
					66% {
						transform: translate(-20px, 20px) rotate(-5deg) scale(0.95);
					}
				}
				@keyframes blobFloat2 {
					0%, 100% {
						transform: translate(0, 0) rotate(0deg) scale(1);
					}
					33% {
						transform: translate(-40px, 30px) rotate(-8deg) scale(1.08);
					}
					66% {
						transform: translate(30px, -40px) rotate(5deg) scale(0.92);
					}
				}
				@keyframes blobFloat3 {
					0%, 100% {
						transform: translate(0, 0) rotate(0deg) scale(1);
					}
					50% {
						transform: translate(-25px, -35px) rotate(12deg) scale(1.1);
					}
				}
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
			`}</style>
		</div>
	);
}
