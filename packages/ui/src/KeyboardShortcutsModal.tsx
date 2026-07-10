import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['V'], label: 'Select & Move Tool' },
    { keys: ['R'], label: 'Rectangle Shape Tool' },
    { keys: ['O'], label: 'Circle Shape Tool' },
    { keys: ['P'], label: 'Pen (Path) Tool' },
    { keys: ['T'], label: 'Text Placement Tool' },
    { keys: ['Ctrl', 'Z'], label: 'Undo Last Action' },
    { keys: ['Ctrl', 'Y'], label: 'Redo Last Action' },
    { keys: ['Ctrl', 'K'], label: 'Search Command Palette' },
    { keys: ['Delete'], label: 'Delete Selected Element' },
    { keys: ['Esc'], label: 'Cancel Current Tool / Deselect' },
    { keys: ['↑', '↓', '←', '→'], label: 'Nudge Selected Shape (1px)' },
  ];

  return (
    <div className="fixed inset-0 bg-[#000]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface-bright border border-outline-variant rounded-xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Keyboard className="w-4.5 h-4.5 text-primary" />
            Workspace Key Bindings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-outline-variant/20 last:border-0">
                <span className="text-xs font-semibold text-on-surface-variant">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="text-[10px] font-mono font-bold bg-surface-container border border-outline-variant text-on-surface px-1.5 py-0.5 rounded shadow-sm"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
