import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import type { ComponentChildren } from 'preact';

interface CollapsibleProps {
	label: string;
	badge?: string;
	badgeColor?: string;
	preview?: ComponentChildren;
	children: ComponentChildren;
	defaultOpen?: boolean;
}

export function Collapsible({
	label,
	badge,
	badgeColor,
	preview,
	children,
	defaultOpen = false
}: CollapsibleProps) {
	return (
		<BaseCollapsible.Root defaultOpen={defaultOpen} className="border-b border-zinc-100/80">
			<BaseCollapsible.Trigger
				className="flex items-center justify-between w-full py-3 text-left group
					transition-colors duration-150
					focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1"
			>
				<div class="flex items-center gap-2">
					<span class="text-[13px] font-medium text-zinc-700">{label}</span>
					{badge && (
						<span
							class="px-2 py-0.5 rounded-md text-[11px] font-medium border"
							style={{
								backgroundColor: badgeColor ? `${badgeColor}15` : undefined,
								borderColor: badgeColor ? `${badgeColor}30` : undefined,
								color: badgeColor || undefined,
							}}
						>
							{badge}
						</span>
					)}
					{!badge && !badgeColor && preview}
				</div>
				<svg
					class="w-4 h-4 text-zinc-400 transition-transform duration-200 ease-out group-data-[panel-open]:rotate-90"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</BaseCollapsible.Trigger>
			<BaseCollapsible.Panel
				className="overflow-hidden transition-all duration-200 ease-out
					data-[starting-style]:h-0 data-[ending-style]:h-0"
				style={{
					height: 'var(--collapsible-panel-height)',
				}}
			>
				<div class="pb-3 space-y-2">
					{children}
				</div>
			</BaseCollapsible.Panel>
		</BaseCollapsible.Root>
	);
}

// Expandable row that acts like a button with chevron
interface ExpandableRowProps {
	label: string;
	badge?: string;
	preview?: ComponentChildren;
	onClick?: () => void;
}

export function ExpandableRow({ label, badge, preview, onClick }: ExpandableRowProps) {
	return (
		<button
			onClick={onClick}
			class="flex items-center justify-between w-full py-3 border-b border-zinc-100/80
				transition-colors duration-150 text-left
				hover:bg-zinc-50/50
				focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1"
		>
			<div class="flex items-center gap-2">
				<span class="text-[13px] font-medium text-zinc-700">{label}</span>
				{badge && (
					<span class="px-2 py-0.5 bg-zinc-100 border border-zinc-200/60 rounded-md text-[11px] text-zinc-500 font-medium">
						{badge}
					</span>
				)}
			</div>
			<div class="flex items-center gap-2">
				{preview}
				<svg
					class="w-4 h-4 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</button>
	);
}
