import { hasImage } from '../../store/editor';
import { FrameControls } from './FrameControls';
import { BackgroundPicker } from './BackgroundPicker';
import { CanvasSize } from './CanvasSize';
import { AIChat } from './AIChat';
import { AIPresets } from './AIPresets';
import { ExportButtons } from './ExportButtons';
import { Tabs, TabList, Tab, TabPanel } from '../ui/Tabs';

// Tab icons
function EditIcon() {
	return (
		<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
		</svg>
	);
}

function AIIcon() {
	return (
		<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
		</svg>
	);
}

function PresetsIcon() {
	return (
		<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
		</svg>
	);
}

// Section header - light gray background with centered text
function SectionHeader({ title }: { title: string }) {
	return (
		<div class="px-5 py-2 bg-zinc-50 border-y border-zinc-100">
			<h3 class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">{title}</h3>
		</div>
	);
}

interface SidebarProps {
	width?: number;
}

export function Sidebar({ width = 320 }: SidebarProps) {
	if (!hasImage.value) return null;

	return (
		<aside
			class="bg-white border-l border-zinc-200 flex flex-col overflow-hidden shrink-0"
			style={{ width: `${width}px` }}
		>
			<Tabs defaultValue="edit">
				<TabList>
					<Tab value="edit" icon={<EditIcon />}>Edit</Tab>
					<Tab value="ai" icon={<AIIcon />}>AI</Tab>
					<Tab value="presets" icon={<PresetsIcon />}>Presets</Tab>
				</TabList>

				<TabPanel value="edit">
					{/* Screenshot Options Section */}
					<SectionHeader title="Screenshot options" />

					{/* Scrollable Content */}
					<div class="flex-1 overflow-y-auto custom-scrollbar">
						{/* Frame Controls */}
						<div class="px-5">
							<FrameControls />
						</div>

						{/* Canvas Options Section */}
						<SectionHeader title="Canvas options" />

						{/* Canvas Size & Background */}
						<div class="px-5">
							<CanvasSize />
							<BackgroundPicker />
						</div>

						{/* Bottom padding for scroll */}
						<div class="h-4" />
					</div>

					{/* Fixed Export Buttons */}
					<div class="px-4 py-3 bg-white border-t border-zinc-200 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)]">
						<ExportButtons />
					</div>
				</TabPanel>

				<TabPanel value="ai">
					<AIChat />
				</TabPanel>

				<TabPanel value="presets">
					<AIPresets />
				</TabPanel>
			</Tabs>
		</aside>
	);
}
