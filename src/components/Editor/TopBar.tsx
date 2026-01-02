import { hasImage, imageData } from '../../store/editor';
import { useState, useEffect } from 'preact/hooks';

export function TopBar() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Get image dimensions
	useEffect(() => {
		if (!imageData.value) {
			setDimensions({ width: 0, height: 0 });
			return;
		}

		const img = new Image();
		img.onload = () => {
			setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
		};
		img.src = imageData.value;
	}, [imageData.value]);

	return (
		<header class="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
			{/* Left Section */}
			<div class="flex items-center gap-3">
				{/* Logo */}
				<a href="/" class="flex items-center gap-2 text-zinc-800 font-semibold">
					<span class="text-xl">🍌</span>
					<span class="hidden sm:inline">Banana</span>
				</a>

				{/* Templates Button */}
				<button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-sm text-zinc-700 transition-colors">
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
					All Templates
				</button>

				{/* Dimensions Display */}
				{hasImage.value && dimensions.width > 0 && (
					<div class="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm text-zinc-500">
						<span class="font-mono">{dimensions.width}</span>
						<span class="text-zinc-400">×</span>
						<span class="font-mono">{dimensions.height}</span>
						<span class="text-zinc-400 ml-0.5">px</span>
					</div>
				)}
			</div>

			{/* Right Section */}
			<div class="flex items-center gap-2">
				{/* Insert Dropdown */}
				<button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-sm text-zinc-700 transition-colors">
					Insert
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{/* Save Preset */}
				<button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-sm text-zinc-700 transition-colors">
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
					</svg>
					Save preset
				</button>

				{/* Settings */}
				<a
					href="/settings"
					class="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
					title="API Settings"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</a>
			</div>
		</header>
	);
}
