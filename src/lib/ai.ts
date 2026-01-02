import { getApiKey, getModel } from './db';
import type { AIMode } from '../store/ai';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GenerateBackgroundRequest {
	prompt: string;
	aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GenerateBackgroundResponse {
	imageUrl: string;
	error?: string;
}

// Chat types for multi-turn conversation
export interface ChatRequest {
	prompt: string;
	mode: AIMode;
	history?: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }>;
	currentScreenshot?: string; // base64 for context
}

export interface ChatResponse {
	text: string;
	imageUrl?: string;
	error?: string;
}

// System prompts for different modes
const SYSTEM_PROMPTS: Record<AIMode, string> = {
	background: `You are an AI assistant for a screenshot editing tool called Screenshots Banana.
Generate beautiful abstract background images when asked.
Make backgrounds subtle, elegant, and suitable for placing behind screenshots.
Use soft gradients, smooth transitions, and aesthetically pleasing colors.
No text, no objects, just abstract patterns or gradients.
Always generate an image with your response.`,

	'generate-ui': `You are an AI assistant for a screenshot editing tool called Screenshots Banana.
Generate realistic UI mockups and app screenshots when asked.
Create professional-looking interfaces with realistic content, icons, and layouts.
The generated images should look like real app screenshots.
Always generate an image with your response.`,

	enhance: `You are an AI assistant for a screenshot editing tool called Screenshots Banana.
Help users enhance, edit, and improve their screenshots.
You can remove elements, add context, improve lighting, or make other edits.
When given a screenshot, apply the requested changes naturally and seamlessly.
Always generate an image with your response.`,

	edit: `You are an AI assistant for a screenshot editing tool called Screenshots Banana.
Help users with their screenshot editing tasks.
You can generate backgrounds, create mockups, enhance screenshots, or give advice.
When the user asks for visual changes, generate an image.
Be helpful and creative.`,
};

/**
 * Generate a background image using Gemini's native image generation
 * Docs: https://ai.google.dev/gemini-api/docs/image-generation
 */
export async function generateBackground(
	request: GenerateBackgroundRequest
): Promise<GenerateBackgroundResponse> {
	const apiKey = await getApiKey();
	if (!apiKey) {
		return { imageUrl: '', error: 'API key not configured' };
	}

	const model = await getModel();

	try {
		const response = await fetch(
			`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: `Generate a beautiful abstract background image. Style: ${request.prompt}. Requirements: Make it subtle and elegant, suitable as a background for a screenshot editor. Use soft gradients, smooth transitions, and muted colors. No text, no objects, just abstract patterns or gradients.`,
								},
							],
						},
					],
					generationConfig: {
						responseModalities: ['TEXT', 'IMAGE'],
					},
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMsg = errorData.error?.message || `API error: ${response.status}`;
			console.error('Gemini API error:', errorMsg);
			return { imageUrl: '', error: errorMsg };
		}

		const data = await response.json();

		// Extract image from response - look for inlineData with image mime type
		const parts = data.candidates?.[0]?.content?.parts || [];
		const imagePart = parts.find(
			(part: any) => part.inlineData?.mimeType?.startsWith('image/')
		);

		if (imagePart?.inlineData?.data) {
			const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
			return { imageUrl };
		}

		return { imageUrl: '', error: 'No image in response' };
	} catch (error) {
		console.error('Generate background error:', error);
		return {
			imageUrl: '',
			error: error instanceof Error ? error.message : 'Generation failed',
		};
	}
}

/**
 * Check if the API key is valid by making a simple request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${GEMINI_API_URL}/gemini-2.0-flash?key=${apiKey}`,
			{ method: 'GET' }
		);
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Chat with Gemini - supports multi-turn conversation with image generation
 * This is the main function for the AI chat feature
 */
export async function chat(request: ChatRequest): Promise<ChatResponse> {
	const apiKey = await getApiKey();
	if (!apiKey) {
		return { text: '', error: 'API key not configured. Please set your Gemini API key in Settings.' };
	}

	const model = await getModel();

	try {
		// Build contents array with history + new message
		const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = [];

		// Add conversation history if present
		if (request.history && request.history.length > 0) {
			contents.push(...request.history);
		}

		// Build new user message parts
		const userParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

		// Add current screenshot if provided (for enhance/edit modes)
		if (request.currentScreenshot) {
			const base64Data = request.currentScreenshot.replace(/^data:image\/\w+;base64,/, '');
			userParts.push({
				inlineData: {
					mimeType: 'image/png',
					data: base64Data,
				},
			});
		}

		// Add user prompt with context
		userParts.push({
			text: request.prompt,
		});

		contents.push({
			role: 'user',
			parts: userParts,
		});

		const response = await fetch(
			`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					systemInstruction: {
						parts: [{ text: SYSTEM_PROMPTS[request.mode] }],
					},
					contents,
					generationConfig: {
						responseModalities: ['TEXT', 'IMAGE'],
					},
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMsg = errorData.error?.message || `API error: ${response.status}`;
			console.error('Gemini API error:', errorMsg);
			return { text: '', error: errorMsg };
		}

		const data = await response.json();

		// Extract text and image from response
		const parts = data.candidates?.[0]?.content?.parts || [];

		let text = '';
		let imageUrl: string | undefined;

		for (const part of parts) {
			if (part.text) {
				text += part.text;
			}
			if (part.inlineData?.mimeType?.startsWith('image/')) {
				imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
			}
		}

		// If no text response, provide default
		if (!text && imageUrl) {
			text = 'Here\'s what I generated:';
		}

		return { text, imageUrl };
	} catch (error) {
		console.error('Chat error:', error);
		return {
			text: '',
			error: error instanceof Error ? error.message : 'Chat failed',
		};
	}
}
