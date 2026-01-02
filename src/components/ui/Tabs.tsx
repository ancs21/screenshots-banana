import { Tabs as BaseTabs } from '@base-ui-components/react/tabs';
import type { ComponentChildren } from 'preact';

interface TabsProps {
  defaultValue: string;
  children: ComponentChildren;
  onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, onValueChange }: TabsProps) {
  return (
    <BaseTabs.Root
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="flex flex-col h-full"
    >
      {children}
    </BaseTabs.Root>
  );
}

interface TabListProps {
  children: ComponentChildren;
}

export function TabList({ children }: TabListProps) {
  return (
    <div class="px-3 pt-3 pb-2 shrink-0">
      <BaseTabs.List className="flex p-1 bg-zinc-100 rounded-xl relative">
        {children}
        <BaseTabs.Indicator
          className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm
						transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
						border border-zinc-200/60"
          style={{
            left: 'calc(var(--active-tab-left) + 4px)',
            width: 'calc(var(--active-tab-width) - 8px)',
          }}
        />
      </BaseTabs.List>
    </div>
  );
}

interface TabProps {
  value: string;
  children: ComponentChildren;
  icon?: ComponentChildren;
}

export function Tab({ value, children, icon }: TabProps) {
  return (
    <BaseTabs.Tab
      value={value}
      className="flex-1 px-3 py-2 text-[13px] font-semibold transition-all duration-150 relative z-10
				text-zinc-500 hover:text-zinc-700
				data-[selected]:text-zinc-900
				focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-inset
				flex items-center justify-center gap-1.5"
    >
      {icon}
      {children}
    </BaseTabs.Tab>
  );
}

interface TabPanelProps {
  value: string;
  children: ComponentChildren;
  className?: string;
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  return (
    <BaseTabs.Panel
      value={value}
      className={`flex-1 flex flex-col overflow-hidden ${className}`}
    >
      {children}
    </BaseTabs.Panel>
  );
}
