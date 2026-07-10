import React, { useState, useEffect, useRef } from 'react';
import { Search, Square, Circle, Type, Eye, EyeOff, Play, Sliders, Keyboard, Sparkles, Trash2, Home, CheckSquare, Download } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShape: (type: 'rectangle' | 'circle' | 'text') => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onClearCanvas: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onOpenExport: () => void;
  onGoHome: () => void;
  onGoWelcome: () => void;
  isGridVisible: boolean;
  isSnapEnabled: boolean;
}

interface CommandItem {
  id: string;
  category: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onAddShape,
  onToggleGrid,
  onToggleSnap,
  onClearCanvas,
  onOpenSettings,
  onOpenShortcuts,
  onOpenAbout,
  onOpenExport,
  onGoHome,
  onGoWelcome,
  isGridVisible,
  isSnapEnabled
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'add-rect',
      category: 'Primitives',
      label: 'Add Rectangle Shape',
      shortcut: 'R',
      icon: <Square className="w-4 h-4" />,
      action: () => { onAddShape('rectangle'); onClose(); }
    },
    {
      id: 'add-circle',
      category: 'Primitives',
      label: 'Add Circle Shape',
      shortcut: 'O',
      icon: <Circle className="w-4 h-4" />,
      action: () => { onAddShape('circle'); onClose(); }
    },
    {
      id: 'add-text',
      category: 'Primitives',
      label: 'Add Text Input Layer',
      shortcut: 'T',
      icon: <Type className="w-4 h-4" />,
      action: () => { onAddShape('text'); onClose(); }
    },
    {
      id: 'toggle-grid',
      category: 'Canvas Controls',
      label: isGridVisible ? 'Hide Alignment Grid' : 'Show Alignment Grid',
      icon: isGridVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
      action: () => { onToggleGrid(); onClose(); }
    },
    {
      id: 'toggle-snap',
      category: 'Canvas Controls',
      label: isSnapEnabled ? 'Disable Grid Snapping' : 'Enable Grid Snapping',
      icon: <CheckSquare className="w-4 h-4" />,
      action: () => { onToggleSnap(); onClose(); }
    },
    {
      id: 'clear-canvas',
      category: 'Workspace Actions',
      label: 'Clear Entire Canvas Layout',
      icon: <Trash2 className="w-4 h-4 text-error" />,
      action: () => { if (confirm('Are you sure you want to clear your current drawing?')) { onClearCanvas(); } onClose(); }
    },
    {
      id: 'export-workspace',
      category: 'Workspace Actions',
      label: 'Export Workspace & Assets...',
      icon: <Download className="w-4 h-4" />,
      action: () => { onOpenExport(); onClose(); }
    },
    {
      id: 'open-settings',
      category: 'Global Modals',
      label: 'Open Canvas Preferences...',
      icon: <Sliders className="w-4 h-4" />,
      action: () => { onOpenSettings(); onClose(); }
    },
    {
      id: 'open-shortcuts',
      category: 'Global Modals',
      label: 'View Keyboard Key Bindings...',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => { onOpenShortcuts(); onClose(); }
    },
    {
      id: 'open-about',
      category: 'Global Modals',
      label: 'About DrawOS CAD...',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => { onOpenAbout(); onClose(); }
    },
    {
      id: 'go-welcome',
      category: 'Navigation',
      label: 'Exit to Dashboard',
      icon: <Home className="w-4 h-4" />,
      action: () => { onGoWelcome(); onClose(); }
    },
    {
      id: 'go-landing',
      category: 'Navigation',
      label: 'View Landing Presentation Page',
      icon: <Play className="w-4 h-4" />,
      action: () => { onGoHome(); onClose(); }
    }
  ];

  // Filter commands
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000]/60 z-[120] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="bg-surface-bright border border-outline-variant rounded-xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden font-sans"
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant/40">
          <Search className="w-4 h-4 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or filter results..."
            className="w-full text-xs bg-transparent outline-none text-on-surface placeholder:text-secondary font-medium"
          />
          <kbd className="text-[10px] font-mono text-secondary bg-surface-container border border-outline-variant px-1.5 py-0.5 rounded shadow-sm shrink-0">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary">
              No matching commands or actions found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-transparent text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`${isSelected ? 'text-on-primary' : 'text-secondary'}`}>
                        {cmd.icon}
                      </span>
                      <div className="overflow-hidden">
                        <span className="text-xs font-semibold block truncate">
                          {cmd.label}
                        </span>
                        <span className={`text-[9px] block font-medium ${isSelected ? 'text-on-primary/60' : 'text-secondary'}`}>
                          {cmd.category}
                        </span>
                      </div>
                    </div>
                    {cmd.shortcut && (
                      <kbd
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${
                          isSelected
                            ? 'bg-primary-container/20 border-white/20 text-on-primary'
                            : 'bg-surface-container border-outline-variant text-on-surface'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-4 py-2.5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-[10px] text-secondary">
          <div className="flex gap-4">
            <span>↑↓ Navigation</span>
            <span>↵ Select</span>
          </div>
          <span>Precision Command Console</span>
        </div>

      </div>
    </div>
  );
}
