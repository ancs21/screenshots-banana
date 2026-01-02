import { get, set, del } from 'idb-keyval';

// Keys
const API_KEY_STORE = 'gemini-api-key';
const MODEL_STORE = 'gemini-model';
const PRESETS_STORE = 'user-presets';

// Available models
export type GeminiModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';

export const GEMINI_MODELS: { id: GeminiModel; name: string; description: string }[] = [
	{ id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image Preview', description: 'Latest & most capable' },
	{ id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', description: 'Fast & efficient' },
];

// API Key management
export async function getApiKey(): Promise<string | null> {
	try {
		return await get<string>(API_KEY_STORE) ?? null;
	} catch {
		return null;
	}
}

export async function setApiKey(key: string): Promise<void> {
	await set(API_KEY_STORE, key);
}

export async function removeApiKey(): Promise<void> {
	await del(API_KEY_STORE);
}

export async function hasApiKey(): Promise<boolean> {
	const key = await getApiKey();
	return key !== null && key.length > 0;
}

// Model management
export async function getModel(): Promise<GeminiModel> {
	try {
		const model = await get<GeminiModel>(MODEL_STORE);
		return model ?? 'gemini-2.5-flash-image'; // Default to flash
	} catch {
		return 'gemini-2.5-flash-image';
	}
}

export async function setModel(model: GeminiModel): Promise<void> {
	await set(MODEL_STORE, model);
}

// Presets management
export interface Preset {
	id: string;
	name: string;
	padding: number;
	borderRadius: number;
	shadow: number;
	rotate: number;
	tilt: number;
	gradientIndex: number;
	patternType: string;
	frameStyle: string;
}

// AI Image Presets
const AI_PRESETS_STORE = 'ai-presets';

export interface AIPreset {
	id: string;
	name: string;
	prompt: string;
	imageData: string; // base64 data URL
	type: 'background' | 'ui' | 'other';
	createdAt: number;
}

export async function getAIPresets(): Promise<AIPreset[]> {
	try {
		return await get<AIPreset[]>(AI_PRESETS_STORE) ?? [];
	} catch {
		return [];
	}
}

export async function saveAIPreset(preset: AIPreset): Promise<void> {
	const presets = await getAIPresets();
	presets.unshift(preset); // Add to beginning (newest first)
	// Keep max 20 presets to avoid storage issues
	const trimmed = presets.slice(0, 20);
	await set(AI_PRESETS_STORE, trimmed);
}

export async function deleteAIPreset(id: string): Promise<void> {
	const presets = await getAIPresets();
	const filtered = presets.filter(p => p.id !== id);
	await set(AI_PRESETS_STORE, filtered);
}

export async function getPresets(): Promise<Preset[]> {
	try {
		return await get<Preset[]>(PRESETS_STORE) ?? [];
	} catch {
		return [];
	}
}

export async function savePreset(preset: Preset): Promise<void> {
	const presets = await getPresets();
	const existing = presets.findIndex(p => p.id === preset.id);
	if (existing >= 0) {
		presets[existing] = preset;
	} else {
		presets.push(preset);
	}
	await set(PRESETS_STORE, presets);
}

export async function deletePreset(id: string): Promise<void> {
	const presets = await getPresets();
	const filtered = presets.filter(p => p.id !== id);
	await set(PRESETS_STORE, filtered);
}
