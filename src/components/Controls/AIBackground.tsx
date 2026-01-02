import { useState } from 'preact/hooks';
import {
  aiPrompt,
  aiGenerating,
  aiBackground,
  backgroundType,
} from '../../store/editor';
import { getApiKey } from '../../lib/db';
import { generateBackground } from '../../lib/ai';

const quickPrompts = [
  'Soft purple gradient with stars',
  'Ocean waves at sunset',
  'Minimal geometric shapes',
  'Northern lights aurora',
  'Retro synthwave grid',
];

export function AIBackground() {
  const [error, setError] = useState<string | null>(null);
  const [noKey, setNoKey] = useState(false);

  const handleGenerate = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) {
      setNoKey(true);
      setError('Please set your Gemini API key in Settings');
      return;
    }

    if (!aiPrompt.value.trim()) {
      setError('Enter a prompt to generate a background');
      return;
    }

    setError(null);
    aiGenerating.value = true;

    try {
      const result = await generateBackground({ prompt: aiPrompt.value });

      if (result.error) {
        throw new Error(result.error);
      }

      aiBackground.value = result.imageUrl;
      backgroundType.value = 'ai';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      aiGenerating.value = false;
    }
  };

  return (
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-medium text-zinc-700">AI Background</h3>
        <span class="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
          Beta
        </span>
      </div>

      {/* Quick prompts */}
      <div class="flex flex-wrap gap-1">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => (aiPrompt.value = prompt)}
            class="text-[10px] px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Prompt input */}
      <div class="flex gap-2">
        <input
          type="text"
          value={aiPrompt.value}
          onInput={(e) =>
            (aiPrompt.value = (e.target as HTMLInputElement).value)
          }
          placeholder="Describe your background..."
          class="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
        />
        <button
          onClick={handleGenerate}
          disabled={aiGenerating.value}
          class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors"
        >
          {aiGenerating.value ? '...' : 'Go'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p class="text-xs text-red-500">
          {error}
          {noKey && (
            <a href="/settings" class="ml-1 text-zinc-700 underline">
              Set API Key
            </a>
          )}
        </p>
      )}

      {/* Preview AI background */}
      {aiBackground.value && (
        <button
          onClick={() => (backgroundType.value = 'ai')}
          class={`relative h-16 rounded-lg overflow-hidden transition-all border
						${backgroundType.value === 'ai' ? 'ring-2 ring-zinc-400 ring-offset-2 border-transparent' : 'border-zinc-200 hover:opacity-80'}`}
        >
          <img
            src={aiBackground.value}
            alt="AI Generated"
            class="w-full h-full object-cover"
          />
          <span class="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1 rounded">
            AI Generated
          </span>
        </button>
      )}
    </div>
  );
}
