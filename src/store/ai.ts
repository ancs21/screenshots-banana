import { signal, computed } from '@preact/signals';
import { getAIPresets, saveAIPreset, deleteAIPreset, type AIPreset } from '../lib/db';

// Chat message types
export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	image?: string; // base64 data URL for generated images
	timestamp: number;
}

// AI modes
export type AIMode = 'background' | 'generate-ui' | 'enhance' | 'edit';

// Chat state
export const chatMessages = signal<ChatMessage[]>([]);
export const chatInput = signal('');
export const isGenerating = signal(false);
export const generationError = signal<string | null>(null);

// Current mode (affects system prompt)
export const aiMode = signal<AIMode>('background');

// Last generated image (can be applied to canvas)
export const lastGeneratedImage = signal<string | null>(null);

// Computed: has messages
export const hasMessages = computed(() => chatMessages.value.length > 0);

// Generate unique ID
function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Actions
export function addUserMessage(content: string): ChatMessage {
	const message: ChatMessage = {
		id: generateId(),
		role: 'user',
		content,
		timestamp: Date.now(),
	};
	chatMessages.value = [...chatMessages.value, message];
	return message;
}

export function addAssistantMessage(content: string, image?: string): ChatMessage {
	const message: ChatMessage = {
		id: generateId(),
		role: 'assistant',
		content,
		image,
		timestamp: Date.now(),
	};
	chatMessages.value = [...chatMessages.value, message];

	if (image) {
		lastGeneratedImage.value = image;
	}

	return message;
}

export function clearChat() {
	chatMessages.value = [];
	chatInput.value = '';
	generationError.value = null;
	lastGeneratedImage.value = null;
}

export function setGenerating(value: boolean) {
	isGenerating.value = value;
	if (value) {
		generationError.value = null;
	}
}

export function setError(error: string | null) {
	generationError.value = error;
}

// Build conversation history for Gemini API (multi-turn)
export function getConversationHistory(): Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> {
	return chatMessages.value.map(msg => ({
		role: msg.role === 'assistant' ? 'model' : 'user',
		parts: msg.image
			? [
				{ text: msg.content },
				{
					inlineData: {
						mimeType: 'image/png',
						data: msg.image.replace(/^data:image\/\w+;base64,/, ''),
					},
				},
			]
			: [{ text: msg.content }],
	}));
}

// AI Presets state
export const aiPresets = signal<AIPreset[]>([]);
export const presetsLoading = signal(false);

// Load presets from IndexedDB
export async function loadAIPresets() {
	presetsLoading.value = true;
	try {
		aiPresets.value = await getAIPresets();
	} finally {
		presetsLoading.value = false;
	}
}

// Save a new AI preset
export async function addAIPreset(name: string, prompt: string, imageData: string, type: AIPreset['type']) {
	const preset: AIPreset = {
		id: generateId(),
		name,
		prompt,
		imageData,
		type,
		createdAt: Date.now(),
	};
	await saveAIPreset(preset);
	await loadAIPresets(); // Refresh list
	return preset;
}

// Remove an AI preset
export async function removeAIPreset(id: string) {
	await deleteAIPreset(id);
	await loadAIPresets(); // Refresh list
}

// Re-export AIPreset type for convenience
export type { AIPreset };
