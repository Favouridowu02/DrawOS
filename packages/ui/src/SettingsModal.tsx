import { X, Sliders, Check, EyeOff, Eye } from 'lucide-react';
import { CanvasSettings } from '@/src/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CanvasSettings;
  onChangeSettings: (settings: CanvasSettings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onChangeSettings }: SettingsModalProps) {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof CanvasSettings>(key: K, value: CanvasSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-[#000]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface-bright border border-outline-variant rounded-xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            Workspace Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Filename Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Default Export Filename</label>
            <input
              type="text"
              value={settings.filename}
              onChange={(e) => updateSetting('filename', e.target.value)}
              placeholder="drawing"
              className="w-full text-xs bg-surface border border-outline-variant hover:border-outline focus:border-primary outline-none px-3.5 py-2.5 rounded-lg text-on-surface transition-colors font-mono"
            />
          </div>

          {/* Grid Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Show Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Grid Display</span>
              <button
                onClick={() => updateSetting('showGrid', !settings.showGrid)}
                className={`w-full py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  settings.showGrid
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                }`}
              >
                {settings.showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {settings.showGrid ? 'Grid Visible' : 'Grid Hidden'}
              </button>
            </div>

            {/* Snap To Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Snap to Grid</span>
              <button
                onClick={() => updateSetting('snapToGrid', !settings.snapToGrid)}
                className={`w-full py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  settings.snapToGrid
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                }`}
              >
                {settings.snapToGrid ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                {settings.snapToGrid ? 'Snapping On' : 'Snapping Off'}
              </button>
            </div>

          </div>

          {/* Grid Size Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Grid Cell Resolution</span>
            <div className="grid grid-cols-4 gap-2">
              {[8, 16, 24, 32].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('gridSize', size)}
                  className={`py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                    settings.gridSize === size
                      ? 'border-on-surface bg-surface-container text-on-surface font-bold'
                      : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Autosave and transparent background */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">Auto-save in Browser</span>
                <span className="text-[10px] text-secondary">Saves drawing local state on every action</span>
              </div>
              <button
                onClick={() => updateSetting('autosave', !settings.autosave)}
                className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer relative ${
                  settings.autosave ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    settings.autosave ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">Transparent Workspace BG</span>
                <span className="text-[10px] text-secondary">Use alpha checkerboard for workspace rendering</span>
              </div>
              <button
                onClick={() => updateSetting('transparentBackground', !settings.transparentBackground)}
                className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer relative ${
                  settings.transparentBackground ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    settings.transparentBackground ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer"
          >
            Apply Configurations
          </button>
        </div>

      </div>
    </div>
  );
}
