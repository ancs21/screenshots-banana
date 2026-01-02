import { useState, useRef, useEffect } from 'preact/hooks';
import { Slider as BaseSlider } from '@base-ui-components/react/slider';

interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	label?: string;
	showValue?: boolean;
	unit?: string;
}

// Editable value badge component
function EditableValue({
	value,
	min,
	max,
	step,
	unit,
	onChange,
}: {
	value: number;
	min: number;
	max: number;
	step: number;
	unit: string;
	onChange: (v: number) => void;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [inputValue, setInputValue] = useState(String(value));
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isEditing) {
			setInputValue(String(value));
		}
	}, [value, isEditing]);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleCommit = () => {
		const parsed = parseFloat(inputValue);
		if (!isNaN(parsed)) {
			const clamped = Math.max(min, Math.min(max, parsed));
			const stepped = Math.round(clamped / step) * step;
			onChange(stepped);
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleCommit();
		} else if (e.key === 'Escape') {
			setInputValue(String(value));
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<input
				ref={inputRef}
				type="text"
				value={inputValue}
				onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
				onBlur={handleCommit}
				onKeyDown={handleKeyDown}
				class="w-12 px-1.5 py-0.5 bg-white border border-zinc-300 rounded-md text-[11px] text-zinc-700
					tabular-nums font-medium text-center
					focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent"
			/>
		);
	}

	return (
		<button
			onClick={() => setIsEditing(true)}
			class="px-2 py-0.5 bg-zinc-100 border border-zinc-200/60 rounded-md text-[11px] text-zinc-500
				tabular-nums font-medium hover:bg-zinc-200 hover:border-zinc-300 transition-colors cursor-text"
		>
			{value}{unit}
		</button>
	);
}

// Main slider with label + editable value badge on left, slider on right
export function Slider({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	label,
	showValue = true,
	unit = '',
}: SliderProps) {
	return (
		<div class="flex items-center gap-4 py-3 border-b border-zinc-100/80 last:border-b-0">
			{/* Left: Label + Editable Value Badge */}
			<div class="flex items-center gap-2 min-w-[100px]">
				{label && (
					<span class="text-[13px] font-medium text-zinc-700">{label}</span>
				)}
				{showValue && (
					<EditableValue
						value={value}
						min={min}
						max={max}
						step={step}
						unit={unit}
						onChange={onChange}
					/>
				)}
			</div>

			{/* Right: Slider */}
			<div class="flex-1">
				<BaseSlider.Root
					value={value}
					onValueChange={(val) => onChange(val as number)}
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					className="group relative flex items-center w-full touch-none select-none"
				>
					<BaseSlider.Control className="flex items-center w-full h-6">
						<BaseSlider.Track className="relative w-full h-[5px] bg-zinc-200/80 rounded-full">
							<BaseSlider.Indicator className="absolute h-full bg-zinc-300 rounded-full" />
							<BaseSlider.Thumb
								className="block w-[14px] h-[22px] bg-zinc-600 rounded-[5px] cursor-pointer
									shadow-sm border border-zinc-500
									transition-all duration-100
									hover:bg-zinc-700 hover:scale-[1.02]
									active:scale-[0.98] active:bg-zinc-800
									focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1"
							/>
						</BaseSlider.Track>
					</BaseSlider.Control>
				</BaseSlider.Root>
			</div>
		</div>
	);
}

// Inline slider without label (for use inside expandable sections)
export function InlineSlider({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
}: Omit<SliderProps, 'label' | 'showValue' | 'unit'>) {
	return (
		<BaseSlider.Root
			value={value}
			onValueChange={(val) => onChange(val as number)}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			className="group relative flex items-center w-full touch-none select-none"
		>
			<BaseSlider.Control className="flex items-center w-full h-5">
				<BaseSlider.Track className="relative w-full h-[5px] bg-zinc-200/80 rounded-full">
					<BaseSlider.Indicator className="absolute h-full bg-zinc-300 rounded-full" />
					<BaseSlider.Thumb
						className="block w-[14px] h-[22px] bg-zinc-600 rounded-[5px] cursor-pointer
							shadow-sm border border-zinc-500
							transition-all duration-100
							hover:bg-zinc-700 hover:scale-[1.02]
							active:scale-[0.98] active:bg-zinc-800
							focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1"
					/>
				</BaseSlider.Track>
			</BaseSlider.Control>
		</BaseSlider.Root>
	);
}

// Compact slider for tight spaces (slider only, no wrapper padding)
export function CompactSlider({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
}: Omit<SliderProps, 'label' | 'showValue' | 'unit'>) {
	return (
		<BaseSlider.Root
			value={value}
			onValueChange={(val) => onChange(val as number)}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			className="group relative flex items-center w-full touch-none select-none"
		>
			<BaseSlider.Control className="flex items-center w-full h-6">
				<BaseSlider.Track className="relative w-full h-[5px] bg-zinc-200/80 rounded-full">
					<BaseSlider.Indicator className="absolute h-full bg-zinc-300 rounded-full" />
					<BaseSlider.Thumb
						className="block w-[14px] h-[22px] bg-zinc-600 rounded-[5px] cursor-pointer
							shadow-sm border border-zinc-500
							transition-all duration-100
							hover:bg-zinc-700 hover:scale-[1.02]
							active:scale-[0.98] active:bg-zinc-800
							focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1"
					/>
				</BaseSlider.Track>
			</BaseSlider.Control>
		</BaseSlider.Root>
	);
}
