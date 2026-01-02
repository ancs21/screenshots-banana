import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { DropZone } from '../../components/Editor/DropZone';
import { Canvas } from '../../components/Editor/Canvas';
import { Sidebar } from '../../components/Controls/Sidebar';
import { hasImage } from '../../store/editor';

const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 640;
const DEFAULT_SIDEBAR_WIDTH = 340;

// Apple-style Liquid Glass Background
function LiquidGlassBackground() {
  return (
    <div class="absolute inset-0 overflow-hidden">
      {/* Base gradient - soft, warm tones */}
      <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100" />

      {/* Animated gradient orbs - Apple visionOS style */}
      <div
        class="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]
				rounded-full bg-gradient-to-br from-blue-300/40 via-cyan-200/30 to-teal-300/20
				blur-[80px] animate-[liquidOrb1_30s_ease-in-out_infinite]"
      />

      <div
        class="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px]
				rounded-full bg-gradient-to-tl from-violet-300/40 via-purple-200/30 to-fuchsia-300/20
				blur-[80px] animate-[liquidOrb2_25s_ease-in-out_infinite]"
      />

      <div
        class="absolute top-[30%] right-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px]
				rounded-full bg-gradient-to-bl from-rose-200/30 via-pink-200/25 to-orange-200/20
				blur-[60px] animate-[liquidOrb3_20s_ease-in-out_infinite]"
      />

      <div
        class="absolute bottom-[20%] left-[15%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px]
				rounded-full bg-gradient-to-tr from-emerald-200/25 via-teal-200/20 to-cyan-200/15
				blur-[50px] animate-[liquidOrb4_22s_ease-in-out_infinite]"
      />

      {/* Subtle light streaks - refraction effect */}
      <div
        class="absolute top-[10%] left-[30%] w-[40vw] h-[1px]
				bg-gradient-to-r from-transparent via-white/40 to-transparent
				rotate-[-15deg] blur-[1px] animate-[shimmerStreak_8s_ease-in-out_infinite]"
      />

      <div
        class="absolute bottom-[25%] right-[25%] w-[30vw] h-[1px]
				bg-gradient-to-r from-transparent via-white/30 to-transparent
				rotate-[20deg] blur-[1px] animate-[shimmerStreak_10s_ease-in-out_infinite_2s]"
      />

      {/* Noise texture for depth */}
      <div
        class="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Keyframe animations */}
      <style>{`
				@keyframes liquidOrb1 {
					0%, 100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.6;
					}
					25% {
						transform: translate(80px, 40px) scale(1.1);
						opacity: 0.5;
					}
					50% {
						transform: translate(40px, 80px) scale(0.95);
						opacity: 0.7;
					}
					75% {
						transform: translate(-30px, 50px) scale(1.05);
						opacity: 0.55;
					}
				}
				@keyframes liquidOrb2 {
					0%, 100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.5;
					}
					33% {
						transform: translate(-60px, -40px) scale(1.08);
						opacity: 0.6;
					}
					66% {
						transform: translate(40px, -60px) scale(0.92);
						opacity: 0.45;
					}
				}
				@keyframes liquidOrb3 {
					0%, 100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.4;
					}
					50% {
						transform: translate(-50px, 30px) scale(1.15);
						opacity: 0.55;
					}
				}
				@keyframes liquidOrb4 {
					0%, 100% {
						transform: translate(0, 0) scale(1);
						opacity: 0.35;
					}
					40% {
						transform: translate(40px, -30px) scale(1.1);
						opacity: 0.5;
					}
					80% {
						transform: translate(-20px, 40px) scale(0.9);
						opacity: 0.4;
					}
				}
				@keyframes shimmerStreak {
					0%, 100% {
						opacity: 0.3;
						transform: translateX(-20px) rotate(-15deg);
					}
					50% {
						opacity: 0.6;
						transform: translateX(20px) rotate(-15deg);
					}
				}
			`}</style>
    </div>
  );
}

export default function Editor() {
  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(
        localStorage.getItem('sidebar-width') || String(DEFAULT_SIDEBAR_WIDTH)
      );
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      const clampedWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, newWidth)
      );
      setSidebarWidth(clampedWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      localStorage.setItem('sidebar-width', String(sidebarWidth));
    }
  }, [isResizing, sidebarWidth]);

  // Global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div class="h-screen w-screen relative">
      {/* Liquid Glass Background */}
      <LiquidGlassBackground />

      {/* App Container with frosted glass effect */}
      <div class="relative z-10 h-full w-full p-3">
        <div
          ref={containerRef}
          class="h-full w-full flex overflow-hidden
						bg-white/70 backdrop-blur-xl
						border border-white/50
						shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset,0_32px_64px_-16px_rgba(0,0,0,0.1)]
						rounded-2xl"
        >
          {/* Canvas Area */}
          <main
            class="flex-1 flex items-center justify-center overflow-auto custom-scrollbar
						bg-gradient-to-br from-white/40 to-zinc-100/60"
          >
            {hasImage.value ? <Canvas /> : <DropZone />}
          </main>

          {/* Resize Handle */}
          {hasImage.value && (
            <div
              onMouseDown={handleMouseDown}
              class={`resize-handle w-1.5 hover:w-2 transition-all duration-150 cursor-col-resize
								${isResizing ? 'bg-blue-400/60 w-2' : 'bg-zinc-300/50 hover:bg-zinc-400/50'}`}
            />
          )}

          {/* Sidebar */}
          <Sidebar width={sidebarWidth} />
        </div>
      </div>
    </div>
  );
}
