import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
import type { ComponentChildren } from 'preact';

interface TooltipProps {
  content: string;
  children: ComponentChildren;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  sideOffset = 6,
  delay = 150,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={0}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          className="inline-flex"
          render={(props) => <span {...props}>{children}</span>}
        >
          {children}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
            <BaseTooltip.Popup
              className="px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md shadow-lg
								border border-zinc-700
								animate-in fade-in-0 zoom-in-95 duration-100"
            >
              <BaseTooltip.Arrow
                className="fill-zinc-800"
                render={(props) => (
                  <svg {...props} width="10" height="5" viewBox="0 0 10 5">
                    <path d="M0 0L5 5L10 0" />
                  </svg>
                )}
              />
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

// Wrapper for icon buttons with tooltip
interface IconButtonProps {
  icon: ComponentChildren;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function IconButton({
  icon,
  tooltip,
  onClick,
  disabled = false,
  active = false,
  size = 'md',
  className = '',
}: IconButtonProps) {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${sizeClasses} flex items-center justify-center rounded-lg transition-all duration-150
					${
            active
              ? 'bg-zinc-800 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
          }
					${disabled ? 'opacity-40 cursor-not-allowed' : ''}
					${className}`}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
