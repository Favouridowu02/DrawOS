import { useState, useEffect } from 'react';
import { Drawing, CanvasSettings, DrawingObject } from '@/src/types';
import {
  LandingPage,
  WelcomeScreen,
  MainEditor,
  SettingsModal,
  KeyboardShortcutsModal,
  AboutModal,
  ExportModal,
  CommandPalette
} from '@drawos/ui';

type ScreenType = 'landing' | 'welcome' | 'editor';

// Beautiful Preloaded Showcase Examples for Onboarding
const PRELOADED_SAMPLES: Drawing[] = [
  {
    id: 'sample-precision-ring',
    name: 'Precision Ring Core',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objects: [
      {
        id: 'ring-rect-1',
        type: 'rectangle',
        x: 320,
        y: 200,
        width: 160,
        height: 160,
        fill: '#e9edff',
        stroke: '#004ac6',
        strokeWidth: 2
      },
      {
        id: 'ring-circle-1',
        type: 'circle',
        x: 400,
        y: 280,
        radius: 110,
        fill: 'transparent',
        stroke: '#004ac6',
        strokeWidth: 1.5
      },
      {
        id: 'ring-circle-2',
        type: 'circle',
        x: 400,
        y: 280,
        radius: 50,
        fill: '#2563eb',
        stroke: '#00174b',
        strokeWidth: 2
      },
      {
        id: 'ring-text-1',
        type: 'text',
        x: 325,
        y: 110,
        text: 'ALIGNMENT_RING_V2.0',
        fill: 'transparent',
        stroke: '#565e74',
        strokeWidth: 1
      },
      {
        id: 'ring-path-1',
        type: 'path',
        x: 400,
        y: 280,
        points: 'M 400 170 L 400 390 M 290 280 L 510 280',
        fill: 'transparent',
        stroke: '#ba1a1a',
        strokeWidth: 1
      }
    ]
  },
  {
    id: 'sample-dashboard-wireframe',
    name: 'Minimal UI Wireframe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objects: [
      {
        id: 'wf-bg',
        type: 'rectangle',
        x: 180,
        y: 100,
        width: 440,
        height: 320,
        fill: '#f1f3ff',
        stroke: '#737686',
        strokeWidth: 1.5
      },
      {
        id: 'wf-header',
        type: 'rectangle',
        x: 180,
        y: 100,
        width: 440,
        height: 48,
        fill: '#ffffff',
        stroke: '#c3c6d7',
        strokeWidth: 1
      },
      {
        id: 'wf-nav-title',
        type: 'text',
        x: 200,
        y: 124,
        text: 'DrawOS Console',
        fill: 'transparent',
        stroke: '#151b2a',
        strokeWidth: 1
      },
      {
        id: 'wf-card-1',
        type: 'rectangle',
        x: 210,
        y: 170,
        width: 170,
        height: 220,
        fill: '#ffffff',
        stroke: '#c3c6d7',
        strokeWidth: 1
      },
      {
        id: 'wf-image-1',
        type: 'image',
        x: 230,
        y: 190,
        width: 130,
        height: 100,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        fill: 'transparent',
        stroke: '#2563eb',
        strokeWidth: 1
      },
      {
        id: 'wf-text-card',
        type: 'text',
        x: 230,
        y: 320,
        text: 'Interactive Layout',
        fill: 'transparent',
        stroke: '#151b2a',
        strokeWidth: 1
      },
      {
        id: 'wf-card-2',
        type: 'rectangle',
        x: 410,
        y: 170,
        width: 180,
        height: 100,
        fill: '#2563eb',
        stroke: '#00174b',
        strokeWidth: 1
      },
      {
        id: 'wf-text-white',
        type: 'text',
        x: 430,
        y: 220,
        text: 'Active Session',
        fill: 'transparent',
        stroke: '#ffffff',
        strokeWidth: 1
      }
    ]
  }
];

const DEFAULT_SETTINGS: CanvasSettings = {
  gridSize: 24,
  snapToGrid: true,
  autosave: true,
  exportQuality: 2,
  showGrid: true,
  transparentBackground: false,
  includeMetadata: true,
  filename: 'drawos_precision'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  
  // Drawings registry
  const [recentDrawings, setRecentDrawings] = useState<Drawing[]>([]);
  const [activeDrawing, setActiveDrawing] = useState<Drawing | null>(null);

  // Settings
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_SETTINGS);

  // Modal display toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Load drawings and settings on mount
  useEffect(() => {
    // Recent Drawings
    const storedDrawings = localStorage.getItem('drawos-recent-drawings');
    if (storedDrawings) {
      try {
        setRecentDrawings(JSON.parse(storedDrawings));
      } catch (e) {
        setRecentDrawings(PRELOADED_SAMPLES);
      }
    } else {
      setRecentDrawings(PRELOADED_SAMPLES);
      localStorage.setItem('drawos-recent-drawings', JSON.stringify(PRELOADED_SAMPLES));
    }

    // Settings
    const storedSettings = localStorage.getItem('drawos-canvas-settings');
    if (storedSettings) {
      try {
        setCanvasSettings(JSON.parse(storedSettings));
      } catch (e) {
        setCanvasSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  // Sync canvas settings to storage on update
  const handleUpdateSettings = (newSettings: CanvasSettings) => {
    setCanvasSettings(newSettings);
    localStorage.setItem('drawos-canvas-settings', JSON.stringify(newSettings));
  };

  // Create a pristine new drawing
  const handleCreateNewDrawing = () => {
    const freshDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      name: 'Untitled Drawing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      objects: []
    };

    const updatedList = [freshDrawing, ...recentDrawings];
    setRecentDrawings(updatedList);
    localStorage.setItem('drawos-recent-drawings', JSON.stringify(updatedList));

    setActiveDrawing(freshDrawing);
    setCurrentScreen('editor');
  };

  // Open an imported JSON drawing
  const handleOpenImportedJSON = (imported: Drawing) => {
    const exists = recentDrawings.some(d => d.id === imported.id);
    let updatedList = [...recentDrawings];
    if (!exists) {
      updatedList = [imported, ...recentDrawings];
    } else {
      updatedList = updatedList.map(d => d.id === imported.id ? imported : d);
    }

    setRecentDrawings(updatedList);
    localStorage.setItem('drawos-recent-drawings', JSON.stringify(updatedList));

    setActiveDrawing(imported);
    setCurrentScreen('editor');
  };

  // Load a drawing by ID
  const handleLoadDrawing = (id: string) => {
    const found = recentDrawings.find(d => d.id === id);
    if (found) {
      setActiveDrawing(found);
      setCurrentScreen('editor');
    }
  };

  // Save the modified active drawing
  const handleSaveActiveDrawing = (updated: Drawing) => {
    setActiveDrawing(updated);

    const updatedList = recentDrawings.map(d => d.id === updated.id ? updated : d);
    setRecentDrawings(updatedList);

    if (canvasSettings.autosave) {
      localStorage.setItem('drawos-recent-drawings', JSON.stringify(updatedList));
    }
  };

  // Delete drawing from registry
  const handleDeleteDrawing = (id: string) => {
    const updated = recentDrawings.filter(d => d.id !== id);
    setRecentDrawings(updated);
    localStorage.setItem('drawos-recent-drawings', JSON.stringify(updated));
  };

  // Add shapes from Command Palette
  const handleCommandPaletteAddShape = (type: 'rectangle' | 'circle' | 'text') => {
    if (!activeDrawing) return;

    let newObj: DrawingObject | null = null;
    const newId = `obj-cmd-${Date.now()}`;
    const cx = 400; // Center values
    const cy = 280;

    if (type === 'rectangle') {
      newObj = {
        id: newId,
        type: 'rectangle',
        x: cx - 50,
        y: cy - 35,
        width: 100,
        height: 70,
        fill: '#2563eb',
        stroke: '#00174b',
        strokeWidth: 2
      };
    } else if (type === 'circle') {
      newObj = {
        id: newId,
        type: 'circle',
        x: cx,
        y: cy,
        radius: 40,
        fill: '#2563eb',
        stroke: '#00174b',
        strokeWidth: 2
      };
    } else if (type === 'text') {
      newObj = {
        id: newId,
        type: 'text',
        x: cx - 60,
        y: cy,
        text: 'Cmd Text Layer',
        fill: 'transparent',
        stroke: '#00174b',
        strokeWidth: 1
      };
    }

    if (newObj) {
      const updatedObjects = [...activeDrawing.objects, newObj];
      handleSaveActiveDrawing({
        ...activeDrawing,
        objects: updatedObjects
      });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      
      {/* Primary Screen Navigation Manager */}
      {currentScreen === 'landing' && (
        <LandingPage 
          onLaunchEditor={() => setCurrentScreen('welcome')} 
          onLaunchWithTemplate={(templateDrawing) => {
            handleOpenImportedJSON(templateDrawing);
          }}
        />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onCreateNew={handleCreateNewDrawing}
          onOpenJSON={handleOpenImportedJSON}
          recentDrawings={recentDrawings}
          onLoadDrawing={handleLoadDrawing}
          onDeleteDrawing={handleDeleteDrawing}
          onBackToHome={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'editor' && activeDrawing && (
        <MainEditor
          onBack={() => {
            // Commit final save before exit
            localStorage.setItem('drawos-recent-drawings', JSON.stringify(recentDrawings));
            setCurrentScreen('welcome');
          }}
          drawing={activeDrawing}
          onSaveDrawing={handleSaveActiveDrawing}
          canvasSettings={canvasSettings}
          onChangeSettings={handleUpdateSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isModalOpen={isSettingsOpen || isShortcutsOpen || isAboutOpen || isExportOpen || isCommandPaletteOpen}
        />
      )}

      {/* Global Command Modals mounted on top */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={canvasSettings}
        onChangeSettings={handleUpdateSettings}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {activeDrawing && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          drawing={activeDrawing}
          canvasSettings={canvasSettings}
        />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddShape={handleCommandPaletteAddShape}
        onToggleGrid={() => handleUpdateSettings({ ...canvasSettings, showGrid: !canvasSettings.showGrid })}
        onToggleSnap={() => handleUpdateSettings({ ...canvasSettings, snapToGrid: !canvasSettings.snapToGrid })}
        onClearCanvas={() => {
          if (activeDrawing) {
            handleSaveActiveDrawing({
              ...activeDrawing,
              objects: []
            });
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onGoHome={() => {
          setCurrentScreen('landing');
          setIsCommandPaletteOpen(false);
        }}
        onGoWelcome={() => {
          setCurrentScreen('welcome');
          setIsCommandPaletteOpen(false);
        }}
        isGridVisible={canvasSettings.showGrid}
        isSnapEnabled={canvasSettings.snapToGrid}
      />

    </div>
  );
}
