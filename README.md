# Screenshots Banana

Beautiful screenshot beautification tool. Add stunning backgrounds, frames, and effects to your screenshots in seconds.

![Screenshots Banana](public/image-banana.webp)

## Features

- **Zero Branding** - No watermarks, no logos, no "made with" badges. Your exports are 100% yours
- **Drag & Drop** - Drop images or paste from clipboard
- **Frame Styles** - 14+ preset frames (macOS, Windows, Arc, browser mockups)
- **Backgrounds** - Gradient presets, patterns, custom images, AI-generated
- **Canvas Presets** - Auto, Free, Tweet, Instagram, Story, App Store sizes
- **Transforms** - Padding, border radius, shadow, rotation, 3D tilt
- **AI Powered** - Generate backgrounds, UI mockups, and enhance screenshots with Gemini
- **Export** - PNG, JPG, SVG, WebP at 1x/2x/3x scale, transparent background option

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/user/screenshots-banana.git
cd screenshots-banana

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
bun run build    # Output to dist/
bun run preview  # Preview production build
```

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. Create a project → Connect to Git
4. Configure build settings:
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` (or higher)

### Option 2: Direct Upload

```bash
bun run build
npx wrangler pages deploy dist --project-name=screenshots-banana
```

## AI Features (Optional)

To use AI-powered features (background generation, UI mockups, enhancement):

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Go to Settings in the app
3. Enter your Gemini API key

Uses `gemini-2.5-flash-image` model (free tier: 1500 requests/day).

## Tech Stack

- [Preact](https://preactjs.com/) + [Signals](https://preactjs.com/guide/v10/signals/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Base UI](https://base-ui.com/)
- [html-to-image](https://github.com/bubkoo/html-to-image)

## License

MIT
