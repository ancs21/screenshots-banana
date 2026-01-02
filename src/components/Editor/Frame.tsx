import { ComponentChildren } from 'preact';
import { frameStyle, borderRadius } from '../../store/editor';

interface FrameProps {
	children: ComponentChildren;
}

// Exact macOS traffic light colors from research
const TRAFFIC_LIGHT_COLORS = {
	close: '#ff6159',
	closeHover: '#bf4942',
	minimize: '#ffbd2e',
	minimizeHover: '#bf8e22',
	maximize: '#28c941',
	maximizeHover: '#1d9730',
};

// macOS traffic light buttons
function TrafficLights({ variant = 'default' }: { variant?: 'default' | 'adaptive' | 'rose' | 'muted' }) {
	if (variant === 'adaptive') {
		return (
			<div class="flex gap-2 px-4 py-3">
				<div class="w-3 h-3 rounded-full border-[1.5px] border-zinc-400" />
				<div class="w-3 h-3 rounded-full border-[1.5px] border-zinc-400" />
				<div class="w-3 h-3 rounded-full border-[1.5px] border-zinc-400" />
			</div>
		);
	}
	if (variant === 'rose') {
		return (
			<div class="flex gap-2 px-4 py-3">
				<div class="w-3 h-3 rounded-full bg-rose-400" />
				<div class="w-3 h-3 rounded-full bg-rose-400" />
				<div class="w-3 h-3 rounded-full bg-rose-400" />
			</div>
		);
	}
	if (variant === 'muted') {
		return (
			<div class="flex gap-2 px-4 py-3">
				<div class="w-3 h-3 rounded-full bg-zinc-300" />
				<div class="w-3 h-3 rounded-full bg-zinc-300" />
				<div class="w-3 h-3 rounded-full bg-zinc-300" />
			</div>
		);
	}
	return (
		<div class="flex gap-2 px-4 py-3">
			<div class="w-3 h-3 rounded-full" style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.close }} />
			<div class="w-3 h-3 rounded-full" style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.minimize }} />
			<div class="w-3 h-3 rounded-full" style={{ backgroundColor: TRAFFIC_LIGHT_COLORS.maximize }} />
		</div>
	);
}

// Windows control buttons
function WindowsControls({ dark = false }: { dark?: boolean }) {
	const textColor = dark ? 'text-zinc-400' : 'text-zinc-500';
	const hoverBg = dark ? 'hover:bg-zinc-600' : 'hover:bg-zinc-200';
	return (
		<div class="flex ml-auto h-8">
			<button class={`w-12 h-full flex items-center justify-center ${hoverBg} ${textColor} transition-colors`}>
				<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
					<line x1="2" y1="6" x2="10" y2="6" />
				</svg>
			</button>
			<button class={`w-12 h-full flex items-center justify-center ${hoverBg} ${textColor} transition-colors`}>
				<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
					<rect x="2" y="2" width="8" height="8" rx="0.5" />
				</svg>
			</button>
			<button class={`w-12 h-full flex items-center justify-center hover:bg-red-500 hover:text-white ${textColor} transition-colors`}>
				<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
					<line x1="2" y1="2" x2="10" y2="10" />
					<line x1="10" y1="2" x2="2" y2="10" />
				</svg>
			</button>
		</div>
	);
}

// Layered shadow style for professional look
const layeredShadow = '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07)';
const subtleShadow = '0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)';

export function Frame({ children }: FrameProps) {
	const style = frameStyle.value;
	const radius = borderRadius.value;

	if (style === 'none') {
		return <>{children}</>;
	}

	// Arc - simple rounded border frame
	if (style === 'arc') {
		return (
			<div
				class="bg-white border-2 border-zinc-200"
				style={{ borderRadius: `${radius}px`, boxShadow: subtleShadow }}
			>
				{children}
			</div>
		);
	}

	// Stack Light - layered cards effect
	if (style === 'stack-light') {
		return (
			<div class="relative" style={{ padding: '12px 6px 0' }}>
				<div
					class="absolute inset-x-3 top-0 bottom-3 bg-zinc-200/70"
					style={{ borderRadius: `${radius}px` }}
				/>
				<div
					class="absolute inset-x-1.5 top-1.5 bottom-1.5 bg-zinc-100"
					style={{ borderRadius: `${radius}px` }}
				/>
				<div
					class="relative bg-white border border-zinc-200"
					style={{ borderRadius: `${radius}px`, marginTop: '12px', boxShadow: subtleShadow }}
				>
					{children}
				</div>
			</div>
		);
	}

	// Stack Dark - layered cards dark
	if (style === 'stack-dark') {
		return (
			<div class="relative" style={{ padding: '12px 6px 0' }}>
				<div
					class="absolute inset-x-3 top-0 bottom-3 bg-zinc-600/60"
					style={{ borderRadius: `${radius}px` }}
				/>
				<div
					class="absolute inset-x-1.5 top-1.5 bottom-1.5 bg-zinc-700"
					style={{ borderRadius: `${radius}px` }}
				/>
				<div
					class="relative bg-zinc-800"
					style={{ borderRadius: `${radius}px`, marginTop: '12px' }}
				>
					{children}
				</div>
			</div>
		);
	}

	// macOS Light
	if (style === 'macos-light') {
		return (
			<div
				class="flex flex-col bg-white overflow-hidden border border-zinc-200/80"
				style={{ borderRadius: `${radius}px`, boxShadow: layeredShadow }}
			>
				<div class="flex items-center bg-gradient-to-b from-[#f6f6f6] to-[#e8e8e8] min-h-[40px] border-b border-zinc-200/60">
					<TrafficLights />
				</div>
				<div class="bg-white">{children}</div>
			</div>
		);
	}

	// macOS Dark
	if (style === 'macos-dark') {
		return (
			<div
				class="flex flex-col bg-zinc-800 overflow-hidden"
				style={{ borderRadius: `${radius}px`, boxShadow: layeredShadow }}
			>
				<div class="flex items-center bg-zinc-700 min-h-[40px]">
					<TrafficLights />
				</div>
				<div class="bg-zinc-800">{children}</div>
			</div>
		);
	}

	// macOS Subtle
	if (style === 'macos-subtle') {
		return (
			<div
				class="flex flex-col bg-white overflow-hidden border border-zinc-200"
				style={{ borderRadius: `${radius}px`, boxShadow: subtleShadow }}
			>
				<div class="flex items-center bg-white min-h-[40px] border-b border-zinc-100">
					<TrafficLights />
				</div>
				<div class="bg-white">{children}</div>
			</div>
		);
	}

	// macOS Adaptive - outline only buttons
	if (style === 'macos-adaptive') {
		return (
			<div
				class="flex flex-col bg-zinc-50 overflow-hidden border border-zinc-200"
				style={{ borderRadius: `${radius}px`, boxShadow: subtleShadow }}
			>
				<div class="flex items-center bg-zinc-100/60 min-h-[40px] border-b border-zinc-200">
					<TrafficLights variant="adaptive" />
				</div>
				<div class="bg-zinc-50">{children}</div>
			</div>
		);
	}

	// Eclipse - curved shadow underneath
	if (style === 'eclipse') {
		return (
			<div class="relative pb-3">
				<div
					class="absolute inset-x-6 bottom-0 h-6 bg-zinc-400/40 rounded-[50%] blur-md"
				/>
				<div
					class="relative bg-white border border-zinc-200"
					style={{ borderRadius: `${radius}px`, boxShadow: subtleShadow }}
				>
					{children}
				</div>
			</div>
		);
	}

	// Silver Back - rose/pink tinted background
	if (style === 'silver-back') {
		return (
			<div
				class="bg-gradient-to-br from-rose-100 to-rose-200 p-3"
				style={{ borderRadius: `${radius}px` }}
			>
				<div
					class="flex flex-col bg-white overflow-hidden border border-rose-200/60"
					style={{ borderRadius: `${Math.max(4, radius - 4)}px`, boxShadow: subtleShadow }}
				>
					<div class="flex items-center bg-rose-50/80 min-h-[40px] border-b border-rose-100">
						<TrafficLights variant="rose" />
					</div>
					<div class="bg-white">{children}</div>
				</div>
			</div>
		);
	}

	// Shadow Back - prominent shadow behind
	if (style === 'shadow-back') {
		return (
			<div class="relative pb-2">
				<div
					class="absolute inset-x-4 top-4 bottom-0 bg-zinc-400/30 blur-xl rounded-xl"
				/>
				<div
					class="relative flex flex-col bg-white overflow-hidden border border-zinc-200"
					style={{ borderRadius: `${radius}px`, boxShadow: layeredShadow }}
				>
					<div class="flex items-center bg-zinc-50 min-h-[40px] border-b border-zinc-100">
						<TrafficLights variant="muted" />
					</div>
					<div class="bg-white">{children}</div>
				</div>
			</div>
		);
	}

	// Windows Light
	if (style === 'windows-light') {
		return (
			<div
				class="flex flex-col bg-white overflow-hidden border border-zinc-200"
				style={{ borderRadius: `${Math.min(radius, 8)}px`, boxShadow: layeredShadow }}
			>
				<div class="flex items-center bg-zinc-50 h-10 border-b border-zinc-100">
					<WindowsControls dark={false} />
				</div>
				<div class="bg-white">{children}</div>
			</div>
		);
	}

	// Windows Dark
	if (style === 'windows-dark') {
		return (
			<div
				class="flex flex-col bg-zinc-800 overflow-hidden"
				style={{ borderRadius: `${Math.min(radius, 8)}px`, boxShadow: layeredShadow }}
			>
				<div class="flex items-center bg-zinc-700 h-10">
					<WindowsControls dark={true} />
				</div>
				<div class="bg-zinc-800">{children}</div>
			</div>
		);
	}

	// Shortboard - thick dark border
	if (style === 'shortboard') {
		return (
			<div
				class="bg-white border-[3px] border-zinc-800"
				style={{ borderRadius: `${radius}px` }}
			>
				{children}
			</div>
		);
	}

	// Ruler - dashed border
	if (style === 'ruler') {
		return (
			<div
				class="bg-white border-2 border-dashed border-zinc-400"
				style={{ borderRadius: `${radius}px` }}
			>
				{children}
			</div>
		);
	}

	// Emotion - soft rounded with subtle gradient
	if (style === 'emotion') {
		return (
			<div
				class="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200"
				style={{ borderRadius: `${Math.max(radius, 20)}px`, boxShadow: layeredShadow }}
			>
				{children}
			</div>
		);
	}

	// Fallback
	return <>{children}</>;
}
