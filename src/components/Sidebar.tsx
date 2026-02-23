import React from 'react';
import { 
  CommandPalette, Robot, Storefront, ChevronLeft, ChevronRight 
} from '@phosphor-icons/react';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'command-center', icon: CommandPalette, label: 'Command Center' },
  { id: 'agent-workspace', icon: Robot, label: 'Agent Workspace' },
  { id: 'marketplace', icon: Storefront, label: 'Marketplace' },
];

export const Sidebar: React.FC<Props> = ({ collapsed, onToggle, activeView, onViewChange }) => {
  return (
    <aside className={`hidden lg:flex flex-col h-screen glass border-r border-border/50 transition-all duration-300 z-30 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/30">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">Ω</span>
            </div>
            <span className="font-bold gradient-text font-orbitron text-sm">ARCH1TECH</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm font-medium ${
              activeView === id
                ? 'bg-primary/10 text-primary border-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/30 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Σ-Matrix: Stable</span>
          </div>
        </div>
      )}
    </aside>
  );
};
