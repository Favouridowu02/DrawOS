import React, { useRef, useState } from 'react';
import { Plus, FolderOpen, History, Keyboard, FileText, Trash2, Clock } from 'lucide-react';
import { Drawing } from '../types';

interface WelcomeScreenProps {
  onCreateNew: () => void;
  onOpenJSON: (drawing: Drawing) => void;
  recentDrawings: Drawing[];
  onLoadDrawing: (id: string) => void;
  onDeleteDrawing: (id: string) => void;
  onBackToHome: () => void;
}

export default function WelcomeScreen({
  onCreateNew,
  onOpenJSON,
  recentDrawings,
  onLoadDrawing,
  onDeleteDrawing,
  onBackToHome
}: WelcomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      parseAndLoadFile(file);
    }
  };

  const parseAndLoadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && Array.isArray(json.objects)) {
          // It's a valid drawing
          const importedDrawing: Drawing = {
            id: json.id || `drawing-${Date.now()}`,
            name: json.name || file.name.replace('.json', ''),
            createdAt: json.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            objects: json.objects
          };
          onOpenJSON(importedDrawing);
        } else {
          alert('Invalid DrawOS file. The JSON must contain an "objects" array.');
        }
      } catch (err) {
        alert('Failed to parse file as JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseAndLoadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      className={`bg-background text-on-background min-h-screen font-sans antialiased overflow-hidden flex flex-col transition-colors duration-200 ${
        dragActive ? 'bg-primary-container/5 outline-2 outline-dashed outline-primary m-1 rounded-xl' : ''
      }`}
    >
      {/* TopNavBar */}
      <header className="fixed top-0 w-full h-[56px] border-b border-outline-variant/30 bg-surface-bright/80 backdrop-blur-md flex justify-between items-center px-6 z-50">
        <div className="flex items-center gap-3">
          <button onClick={onBackToHome} className="flex items-center gap-3 hover:opacity-80 transition-all cursor-pointer">
            <img
              alt="DrawOS Logo"
              className="w-8 h-8 rounded"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QXkxy3sALdb0x34RktvYkaT9WCSYexYdwzjaq3puW41PwiPRxGfNpmVhwQgw2yGRMvgaPM93bzsB0rGdXewfzjdfO-SLdD6QEMjKUgYqGPcOT8hYrbxpSqFU5dCqwTxD0IV9W_5yp7pX6LJ40VWYlbPDwBCJZJ7OqFaVqa7hjFX2MQJHpOyx_EY_MrC_Eb-UxAcFQhCwN2hUvjqdQc8qzGXQ9AQ7K1oih6hv1IKklWiXv3uT-1AHGoLjmyReV517OFaGB2ZD9OIa"
            />
            <span className="text-sm font-bold text-on-surface tracking-tight">DrawOS</span>
          </button>
          <nav className="hidden md:flex gap-1 ml-6">
            <button onClick={onBackToHome} className="text-xs font-semibold text-secondary hover:bg-surface-container-low px-3 py-1.5 rounded transition-colors cursor-pointer">Landing</button>
            <a className="text-xs font-semibold text-secondary hover:bg-surface-container-low px-3 py-1.5 rounded transition-colors" href="#features">Features</a>
            <a className="text-xs font-semibold text-secondary hover:bg-surface-container-low px-3 py-1.5 rounded transition-colors" href="#docs">Docs</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCreateNew} className="text-xs font-semibold bg-primary text-on-primary px-4 py-2 rounded-full hover:brightness-105 transition-all cursor-pointer">
            Launch Editor
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className="flex-grow pt-[56px] pb-[32px] flex items-center justify-center p-6 bg-background relative"
      >
        <div className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center text-center space-y-8">
          
          {/* Minimal Geometric Outline Illustration */}
          <div className="w-44 h-44 text-outline-variant/60 relative animate-fade-in">
            <svg
              className="stroke-current stroke-[1.2] w-full h-full"
              fill="none"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="40" width="70" height="70" rx="6"></rect>
              <circle cx="125" cy="125" r="35"></circle>
              <path d="M60 150 L150 60"></path>
              <circle cx="60" cy="150" fill="currentColor" r="4.5"></circle>
              <circle cx="150" cy="60" fill="currentColor" r="4.5"></circle>
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Welcome to DrawOS</h1>
            <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
              Your local vector workspace awaits. Create a pristine drawing from scratch or open an existing drawing JSON.
            </p>
          </div>

          {/* Core Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md justify-center">
            <button
              onClick={onCreateNew}
              className="flex items-center justify-center gap-2 bg-primary text-on-primary text-xs font-semibold px-5 py-3 rounded-lg shadow-sm hover:brightness-105 transition-all flex-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Drawing
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-outline bg-transparent text-on-surface text-xs font-semibold px-5 py-3 rounded-lg hover:bg-surface-container-low transition-colors flex-1 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              Open JSON File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Information Grid (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left pt-4">
            
            {/* Recent Files Panel */}
            <div className="border border-outline-variant/60 rounded-xl p-5 bg-surface-container-lowest flex flex-col h-[260px]">
              <h2 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-secondary" />
                Recent Files
              </h2>

              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                {recentDrawings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full border border-dashed border-outline-variant rounded-lg p-4 text-center">
                    <FileText className="w-6 h-6 text-outline-variant mb-2" />
                    <p className="text-xs text-secondary">No recent files found in local storage.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentDrawings.map((drawing) => (
                      <div
                        key={drawing.id}
                        className="group flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/40 hover:border-primary-container bg-surface-bright/50 hover:bg-primary-container/5 transition-all"
                      >
                        <button
                          onClick={() => onLoadDrawing(drawing.id)}
                          className="flex-grow text-left flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center font-mono text-[10px] font-bold text-primary shrink-0">
                            DRW
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-on-surface truncate pr-2">
                              {drawing.name}
                            </div>
                            <div className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {new Date(drawing.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => onDeleteDrawing(drawing.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-secondary hover:text-error hover:bg-error-container/20 rounded transition-all cursor-pointer"
                          title="Delete drawing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts Panel */}
            <div className="border border-outline-variant/60 rounded-xl p-5 bg-surface-container-lowest flex flex-col h-[260px]">
              <h2 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-secondary" />
                Keyboard Shortcuts
              </h2>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                <ul className="space-y-2.5">
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Select Tool</span>
                    <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">V</kbd>
                  </li>
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Rectangle Tool</span>
                    <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">R</kbd>
                  </li>
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Circle Tool</span>
                    <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">O</kbd>
                  </li>
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Pen (Path) Tool</span>
                    <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">P</kbd>
                  </li>
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Undo / Redo</span>
                    <div className="flex gap-1">
                      <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">Ctrl Z</kbd>
                      <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">Ctrl Y</kbd>
                    </div>
                  </li>
                  <li className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Command Palette</span>
                    <kbd className="text-[10px] font-mono bg-surface-container text-on-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold shadow-sm">Ctrl K</kbd>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-bright border-t border-outline-variant/30 py-3 px-6 shrink-0 text-center flex justify-between items-center z-10">
        <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">© 2026 DRAWOS ENGINE</div>
        <nav className="flex gap-6 text-[10px] font-semibold text-secondary uppercase tracking-wider">
          <a className="hover:text-primary transition-colors" href="#features">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#features">Terms</a>
          <a className="hover:text-primary transition-colors" href="#api">API</a>
          <a className="hover:text-primary transition-colors" href="#features">Status</a>
        </nav>
      </footer>
    </div>
  );
}
