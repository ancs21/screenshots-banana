import { useState, useEffect } from 'preact/hooks';
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  getModel,
  setModel,
  GEMINI_MODELS,
  type GeminiModel,
} from '../../lib/db';

export default function Settings() {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>(
    'gemini-2.5-flash-image'
  );
  const [modelSaved, setModelSaved] = useState(false);

  useEffect(() => {
    getApiKey().then((k) => {
      if (k) {
        setKey('••••••••••••••••' + k.slice(-4));
        setHasKey(true);
      }
    });
    getModel().then(setSelectedModel);
  }, []);

  const handleSave = async () => {
    if (key && !key.startsWith('••••')) {
      await setApiKey(key);
      setHasKey(true);
      setSaved(true);
      setKey('••••••••••••••••' + key.slice(-4));
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRemove = async () => {
    await removeApiKey();
    setKey('');
    setHasKey(false);
  };

  const handleModelChange = async (model: GeminiModel) => {
    setSelectedModel(model);
    await setModel(model);
    setModelSaved(true);
    setTimeout(() => setModelSaved(false), 1500);
  };

  return (
    <div class="min-h-screen bg-stone-100">
      {/* Header */}
      <header class="border-b border-stone-200 bg-white">
        <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="text-stone-500 hover:text-stone-900 text-sm">
            ← Back
          </a>
          <h1 class="font-semibold text-stone-900">Settings</h1>
          <div class="w-12" />
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Model Section */}
        <section class="bg-white border border-stone-200 rounded-lg">
          <div class="px-5 py-4 border-b border-stone-100">
            <h2 class="font-medium text-stone-900">Model</h2>
            <p class="text-sm text-stone-500 mt-0.5">
              Select which Gemini model to use for generation
            </p>
          </div>

          <div class="p-2">
            {GEMINI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                class={`w-full text-left px-4 py-3 rounded-md transition-colors
									${selectedModel === model.id ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class={`w-4 h-4 rounded-full border-2 flex items-center justify-center
											${selectedModel === model.id ? 'border-stone-900' : 'border-stone-300'}`}
                    >
                      {selectedModel === model.id && (
                        <div class="w-2 h-2 rounded-full bg-stone-900" />
                      )}
                    </div>
                    <div>
                      <div class="font-medium text-stone-900 text-sm">
                        {model.name}
                      </div>
                      <div class="text-xs text-stone-500">
                        {model.description}
                      </div>
                    </div>
                  </div>
                  <code class="text-[10px] text-stone-400 font-mono">
                    {model.id}
                  </code>
                </div>
              </button>
            ))}
          </div>

          {modelSaved && (
            <div class="px-5 py-2 bg-stone-50 border-t border-stone-100 text-xs text-stone-600">
              Model updated
            </div>
          )}
        </section>

        {/* API Key Section */}
        <section class="bg-white border border-stone-200 rounded-lg">
          <div class="px-5 py-4 border-b border-stone-100">
            <h2 class="font-medium text-stone-900">API Key</h2>
            <p class="text-sm text-stone-500 mt-0.5">
              Your Gemini API key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                class="text-stone-900 underline underline-offset-2"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div class="p-5 space-y-4">
            <input
              type="password"
              value={key}
              onInput={(e) => setKey((e.target as HTMLInputElement).value)}
              placeholder="AIza..."
              class="w-full px-3 py-2 bg-white border border-stone-300 rounded-md
								text-stone-900 text-sm placeholder:text-stone-400
								focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            />

            <div class="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!key || key.startsWith('••••')}
                class={`px-4 py-2 text-sm font-medium rounded-md transition-colors
									${
                    saved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white'
                  }`}
              >
                {saved ? 'Saved' : 'Save'}
              </button>
              {hasKey && (
                <button
                  onClick={handleRemove}
                  class="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Info */}
        <section class="text-xs text-stone-500 space-y-1 px-1">
          <p>• Your API key is stored locally in your browser</p>
          <p>• Requests go directly to Google — we never see your key</p>
        </section>
      </main>
    </div>
  );
}
