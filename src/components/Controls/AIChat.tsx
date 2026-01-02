import { useRef, useEffect, useState } from 'preact/hooks';
import {
	chatMessages,
	chatInput,
	isGenerating,
	generationError,
	aiMode,
	lastGeneratedImage,
	addUserMessage,
	addAssistantMessage,
	clearChat,
	setGenerating,
	setError,
	getConversationHistory,
	addAIPreset,
	type AIMode as AIModeName,
} from '../../store/ai';
import { imageData, backgroundType, aiBackground } from '../../store/editor';
import { chat } from '../../lib/ai';
import { getApiKey } from '../../lib/db';

// Quick prompts for each mode
const QUICK_PROMPTS: Record<AIModeName, string[]> = {
	background: [
		'Soft sunset gradient',
		'Northern lights aurora',
		'Ocean waves abstract',
		'Minimal geometric',
	],
	'generate-ui': [
		'Banking app dashboard',
		'Social media feed',
		'E-commerce product page',
		'Music player interface',
	],
	enhance: [
		'Remove the status bar',
		'Make it more professional',
		'Add a subtle shadow',
		'Clean up the edges',
	],
	edit: [
		'Generate a gradient background',
		'Create a mobile app mockup',
		'Make colors more vibrant',
	],
};

// Mode config
const MODES: { value: AIModeName; label: string; icon: () => preact.JSX.Element; desc: string }[] = [
	{
		value: 'background',
		label: 'Background',
		icon: () => (
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<path d="M3 16l5-5 4 4 5-5 4 4" />
			</svg>
		),
		desc: 'Generate AI backgrounds',
	},
	{
		value: 'generate-ui',
		label: 'UI',
		icon: () => (
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<rect x="5" y="2" width="14" height="20" rx="2" />
				<path d="M12 18h.01" />
			</svg>
		),
		desc: 'Generate UI mockups',
	},
	{
		value: 'enhance',
		label: 'Enhance',
		icon: () => (
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
				<path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
			</svg>
		),
		desc: 'Enhance your screenshot',
	},
	{
		value: 'edit',
		label: 'Chat',
		icon: () => (
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
			</svg>
		),
		desc: 'Chat about your screenshot',
	},
];

// Image Preview with actions
function ImagePreview({
	imageUrl,
	prompt,
	onApplyBackground,
}: {
	imageUrl: string;
	prompt: string;
	onApplyBackground: () => void;
}) {
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	const handleSavePreset = async () => {
		setSaving(true);
		try {
			const type = aiMode.value === 'background' ? 'background' : aiMode.value === 'generate-ui' ? 'ui' : 'other';
			const name = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
			await addAIPreset(name, prompt, imageUrl, type);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div class="mt-2.5 max-w-[85%]">
			<div class="relative group rounded-xl overflow-hidden shadow-sm">
				<img
					src={imageUrl}
					alt="Generated"
					class="max-h-48 object-contain bg-zinc-50"
				/>
				{/* Action overlay */}
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent
					opacity-0 group-hover:opacity-100 transition-all duration-200
					flex flex-col items-center justify-end p-3 gap-2">
					<button
						onClick={onApplyBackground}
						class="w-full px-3 py-2 bg-white text-zinc-900 text-xs font-semibold rounded-lg
							hover:bg-zinc-100 transition-colors shadow-lg"
					>
						Use as Background
					</button>
					<button
						onClick={handleSavePreset}
						disabled={saving || saved}
						class="w-full px-3 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg
							hover:bg-white/30 disabled:opacity-60 transition-all border border-white/20"
					>
						{saved ? '✓ Saved to Presets' : saving ? 'Saving...' : 'Save to Presets'}
					</button>
				</div>
			</div>
		</div>
	);
}

// Liquid Glass visual element - organic, animated glassmorphism
function LiquidGlass() {
	return (
		<div class="relative w-24 h-24 mb-6">
			{/* Ambient glow */}
			<div class="absolute inset-0 bg-gradient-to-br from-violet-400/30 via-fuchsia-400/20 to-cyan-400/30
				rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]" />

			{/* Main glass container */}
			<div class="relative w-full h-full">
				{/* Background blob 1 - slow drift */}
				<div class="absolute top-1 left-1 w-16 h-16 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]
					bg-gradient-to-br from-violet-500/60 to-indigo-600/60
					backdrop-blur-sm animate-[liquidMorph1_8s_ease-in-out_infinite]
					shadow-lg shadow-violet-500/20" />

				{/* Background blob 2 - counter drift */}
				<div class="absolute bottom-1 right-1 w-14 h-14 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]
					bg-gradient-to-tr from-fuchsia-500/50 to-pink-500/50
					backdrop-blur-sm animate-[liquidMorph2_7s_ease-in-out_infinite]
					shadow-lg shadow-fuchsia-500/20" />

				{/* Primary glass orb */}
				<div class="absolute inset-3 rounded-[50%_50%_45%_55%/55%_45%_55%_45%]
					bg-gradient-to-br from-white/40 via-white/20 to-transparent
					backdrop-blur-md border border-white/30
					animate-[liquidMorph3_6s_ease-in-out_infinite]
					shadow-[inset_0_0_20px_rgba(255,255,255,0.3),0_8px_32px_rgba(139,92,246,0.3)]">

					{/* Inner highlight */}
					<div class="absolute top-2 left-3 w-6 h-3 rounded-full
						bg-gradient-to-r from-white/60 to-transparent blur-[2px]
						animate-[shimmer_3s_ease-in-out_infinite]" />

					{/* Refraction line */}
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
						w-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent
						rotate-[-20deg] animate-[shimmer_4s_ease-in-out_infinite_reverse]" />
				</div>

				{/* Floating sparkle particles */}
				<div class="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-white/80
					animate-[float_3s_ease-in-out_infinite] shadow-sm shadow-white/50" />
				<div class="absolute bottom-4 left-3 w-1 h-1 rounded-full bg-white/60
					animate-[float_4s_ease-in-out_infinite_0.5s]" />
				<div class="absolute top-1/2 right-2 w-0.5 h-0.5 rounded-full bg-white/70
					animate-[float_2.5s_ease-in-out_infinite_1s]" />
			</div>

			{/* Keyframes injected via style tag */}
			<style>{`
				@keyframes liquidMorph1 {
					0%, 100% {
						border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
						transform: translate(0, 0) rotate(0deg);
					}
					25% {
						border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
						transform: translate(2px, -2px) rotate(5deg);
					}
					50% {
						border-radius: 50% 50% 30% 70% / 50% 70% 30% 50%;
						transform: translate(-1px, 2px) rotate(-3deg);
					}
					75% {
						border-radius: 30% 70% 60% 40% / 60% 40% 60% 40%;
						transform: translate(1px, 1px) rotate(2deg);
					}
				}
				@keyframes liquidMorph2 {
					0%, 100% {
						border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
						transform: translate(0, 0) rotate(0deg);
					}
					33% {
						border-radius: 40% 60% 60% 40% / 40% 60% 40% 60%;
						transform: translate(-2px, 1px) rotate(-4deg);
					}
					66% {
						border-radius: 70% 30% 40% 60% / 50% 50% 50% 50%;
						transform: translate(1px, -1px) rotate(3deg);
					}
				}
				@keyframes liquidMorph3 {
					0%, 100% {
						border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%;
					}
					50% {
						border-radius: 45% 55% 50% 50% / 50% 50% 45% 55%;
					}
				}
				@keyframes shimmer {
					0%, 100% { opacity: 0.6; transform: translateX(-2px); }
					50% { opacity: 1; transform: translateX(2px); }
				}
				@keyframes float {
					0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
					50% { transform: translateY(-4px) scale(1.2); opacity: 1; }
				}
			`}</style>
		</div>
	);
}

// Typing indicator with smooth animation
function TypingIndicator() {
	return (
		<div class="flex items-start gap-2">
			<div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600
				flex items-center justify-center shadow-sm shrink-0">
				<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
				</svg>
			</div>
			<div class="bg-zinc-100 rounded-2xl rounded-tl-md px-4 py-3">
				<div class="flex items-center gap-1">
					<span class="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
					<span class="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_ease-in-out_infinite_150ms]" />
					<span class="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_ease-in-out_infinite_300ms]" />
				</div>
			</div>
		</div>
	);
}

export function AIChat() {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const findPromptForImage = (messageId: string): string => {
		const messages = chatMessages.value;
		const msgIndex = messages.findIndex(m => m.id === messageId);
		for (let i = msgIndex - 1; i >= 0; i--) {
			if (messages[i].role === 'user') return messages[i].content;
		}
		return 'AI Generated';
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMessages.value]);

	const handleSend = async () => {
		const prompt = chatInput.value.trim();
		if (!prompt || isGenerating.value) return;

		const apiKey = await getApiKey();
		if (!apiKey) {
			setError('Please set your Gemini API key in Settings');
			return;
		}

		addUserMessage(prompt);
		chatInput.value = '';
		setGenerating(true);

		try {
			const result = await chat({
				prompt,
				mode: aiMode.value,
				history: getConversationHistory().slice(0, -1),
				currentScreenshot: aiMode.value === 'enhance' ? imageData.value ?? undefined : undefined,
			});

			if (result.error) {
				setError(result.error);
				addAssistantMessage(`Sorry, I encountered an error: ${result.error}`);
			} else {
				addAssistantMessage(result.text, result.imageUrl);
			}
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
			setError(errorMsg);
			addAssistantMessage(`Sorry, I encountered an error: ${errorMsg}`);
		} finally {
			setGenerating(false);
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleQuickPrompt = (prompt: string) => {
		chatInput.value = prompt;
		inputRef.current?.focus();
	};

	const handleApplyBackground = (imageUrl: string) => {
		aiBackground.value = imageUrl;
		backgroundType.value = 'ai';
	};

	const currentMode = MODES.find(m => m.value === aiMode.value)!;

	return (
		<div class="flex flex-col h-full bg-zinc-50/50">
			{/* Mode selector - segmented control */}
			<div class="px-3 py-3 bg-white border-b border-zinc-100">
				<div class="flex gap-1 p-1 bg-zinc-100 rounded-xl">
					{MODES.map((mode) => {
						const isActive = aiMode.value === mode.value;
						const Icon = mode.icon;
						return (
							<button
								key={mode.value}
								onClick={() => (aiMode.value = mode.value)}
								class={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold
									transition-all duration-200
									${isActive
										? 'bg-white text-zinc-900 shadow-sm'
										: 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
									}`}
							>
								<Icon />
								<span class="hidden sm:inline">{mode.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Chat content */}
			<div class="flex-1 overflow-y-auto custom-scrollbar">
				{chatMessages.value.length === 0 ? (
					/* Empty state */
					<div class="h-full flex flex-col">
						{/* Hero section */}
						<div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
							<LiquidGlass />
							<h3 class="text-base font-bold text-zinc-800 mb-1">{currentMode.label}</h3>
							<p class="text-xs text-zinc-500 max-w-[180px]">{currentMode.desc}</p>
						</div>

						{/* Quick prompts */}
						<div class="px-4 pb-4">
							<p class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
								Quick prompts
							</p>
							<div class="flex flex-wrap gap-1.5">
								{QUICK_PROMPTS[aiMode.value].map((prompt, i) => (
									<button
										key={prompt}
										onClick={() => handleQuickPrompt(prompt)}
										class="text-[11px] px-3 py-1.5 bg-white border border-zinc-200
											text-zinc-600 rounded-full hover:border-zinc-300 hover:bg-zinc-50
											transition-all duration-150 shadow-sm hover:shadow"
										style={{ animationDelay: `${i * 50}ms` }}
									>
										{prompt}
									</button>
								))}
							</div>
						</div>
					</div>
				) : (
					/* Messages */
					<div class="px-3 py-4 space-y-4">
						{chatMessages.value.map((msg) => (
							<div
								key={msg.id}
								class={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div class={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
									{/* Avatar */}
									{msg.role === 'assistant' && (
										<div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600
											flex items-center justify-center shadow-sm shrink-0">
											<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
											</svg>
										</div>
									)}

									<div class="flex flex-col">
										{/* Message bubble */}
										<div
											class={`px-3.5 py-2.5 text-[13px] leading-relaxed
												${msg.role === 'user'
													? 'bg-zinc-800 text-white rounded-2xl rounded-tr-md'
													: 'bg-white border border-zinc-200 text-zinc-700 rounded-2xl rounded-tl-md shadow-sm'
												}`}
										>
											<p class="whitespace-pre-wrap">{msg.content}</p>
										</div>

										{/* Generated image */}
										{msg.image && (
											<ImagePreview
												imageUrl={msg.image}
												prompt={findPromptForImage(msg.id)}
												onApplyBackground={() => handleApplyBackground(msg.image!)}
											/>
										)}
									</div>
								</div>
							</div>
						))}

						{/* Typing indicator */}
						{isGenerating.value && <TypingIndicator />}

						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Error message */}
			{generationError.value && (
				<div class="mx-3 mb-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
					<p class="text-xs text-red-600">
						{generationError.value}
						{generationError.value.includes('API key') && (
							<a href="/settings" class="ml-1 underline font-semibold hover:text-red-700">
								Set API Key
							</a>
						)}
					</p>
				</div>
			)}

			{/* Input area */}
			<div class="p-3 bg-white border-t border-zinc-100">
				<div class="flex gap-2 items-end">
					<div class="flex-1 relative">
						<input
							ref={inputRef}
							type="text"
							value={chatInput.value}
							onInput={(e) => (chatInput.value = (e.target as HTMLInputElement).value)}
							onKeyDown={handleKeyDown}
							placeholder={
								aiMode.value === 'background'
									? 'Describe a background...'
									: aiMode.value === 'generate-ui'
									? 'Describe UI to generate...'
									: aiMode.value === 'enhance'
									? 'How to enhance...'
									: 'Type a message...'
							}
							disabled={isGenerating.value}
							class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl
								text-sm text-zinc-800 placeholder:text-zinc-400
								focus:outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100
								disabled:opacity-50 transition-all"
						/>
					</div>
					<button
						onClick={handleSend}
						disabled={isGenerating.value || !chatInput.value.trim()}
						class="p-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-300
							text-white rounded-xl transition-all duration-150
							disabled:cursor-not-allowed shadow-sm hover:shadow-md
							active:scale-95"
					>
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7" />
						</svg>
					</button>
				</div>

				{/* Clear button */}
				{chatMessages.value.length > 0 && (
					<button
						onClick={clearChat}
						class="mt-2 text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors font-medium"
					>
						Clear conversation
					</button>
				)}
			</div>
		</div>
	);
}
