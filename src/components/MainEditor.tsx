import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, RotateCw, Settings, Keyboard, Sparkles, 
  Square, Circle, Type, Eye, Trash2, Sliders, Play, 
  Undo, Redo, Command, Copy, MoveUp, MoveDown, Image as ImageIcon,
  FolderOpen, MousePointer, PenTool, Check, Download
} from 'lucide-react';
import { ToolType, DrawingObject, Drawing, CanvasSettings } from '../types';

interface MainEditorProps {
  onBack: () => void;
  drawing: Drawing;
  onSaveDrawing: (drawing: Drawing) => void;
  canvasSettings: CanvasSettings;
  onChangeSettings: (settings: CanvasSettings) => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onOpenExport: () => void;
  onOpenCommandPalette: () => void;
}

export default function MainEditor({
  onBack,
  drawing,
  onSaveDrawing,
  canvasSettings,
  onChangeSettings,
  onOpenSettings,
  onOpenShortcuts,
  onOpenAbout,
  onOpenExport,
  onOpenCommandPalette
}: MainEditorProps) {
  // State from drawing object
  const [objects, setObjects] = useState<DrawingObject[]>(drawing.objects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('select');

  // Drawing state variables
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);

  // Property default values
  const [fillColor, setFillColor] = useState('#2563eb');
  const [strokeColor, setStrokeColor] = useState('#00174b');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Drag state for moving items
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // History Stack for undo/redo
  const [historyPast, setHistoryPast] = useState<DrawingObject[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<DrawingObject[][]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  // Sync state if a different drawing is loaded
  useEffect(() => {
    setObjects(drawing.objects);
    setSelectedId(null);
    setHistoryPast([]);
    setHistoryFuture([]);
  }, [drawing]);

  // Color Palette suggestions
  const presetColors = [
    { value: '#004ac6', name: 'Primary blue' },
    { value: '#2563eb', name: 'Container blue' },
    { value: '#ba1a1a', name: 'Error red' },
    { value: '#565e74', name: 'Secondary slate' },
    { value: '#46566c', name: 'Tertiary slate' },
    { value: '#131b2e', name: 'Deep navy' },
    { value: '#e9edff', name: 'Light blue' },
    { value: 'transparent', name: 'Transparent' }
  ];

  // Helper: push to history
  const pushHistory = (newObjects: DrawingObject[]) => {
    setHistoryPast(prev => [...prev, objects]);
    setHistoryFuture([]);
    setObjects(newObjects);
    
    // Auto trigger save
    onSaveDrawing({
      ...drawing,
      objects: newObjects,
      updatedAt: new Date().toISOString()
    });
  };

  // Undo Function
  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);
    
    setHistoryFuture(prev => [objects, ...prev]);
    setHistoryPast(newPast);
    setObjects(previous);
    setSelectedId(null);

    onSaveDrawing({
      ...drawing,
      objects: previous,
      updatedAt: new Date().toISOString()
    });
  };

  // Redo Function
  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    setHistoryPast(prev => [...prev, objects]);
    setHistoryFuture(newFuture);
    setObjects(next);
    setSelectedId(null);

    onSaveDrawing({
      ...drawing,
      objects: next,
      updatedAt: new Date().toISOString()
    });
  };

  // Setup Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside input/textarea
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();

      // Tool switches
      if (key === 'v') {
        setActiveTool('select');
      } else if (key === 'r') {
        setActiveTool('rectangle');
      } else if (key === 'o') {
        setActiveTool('circle');
      } else if (key === 'p') {
        setActiveTool('path');
      } else if (key === 't') {
        setActiveTool('text');
      } else if (key === 'i') {
        setActiveTool('image');
      }

      // Delete action
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          handleDeleteObject(selectedId);
        }
      }

      // Esc deselects
      if (e.key === 'Escape') {
        setSelectedId(null);
        setActiveTool('select');
      }

      // Undo / Redo
      if (e.ctrlKey || e.metaKey) {
        if (key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (key === 'y') {
          e.preventDefault();
          handleRedo();
        } else if (key === 'k') {
          e.preventDefault();
          onOpenCommandPalette();
        }
      }

      // Arrow keys nudges selected shape
      if (selectedId && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        const nudgeAmount = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (key === 'arrowup') dy = -nudgeAmount;
        if (key === 'arrowdown') dy = nudgeAmount;
        if (key === 'arrowleft') dx = -nudgeAmount;
        if (key === 'arrowright') dx = nudgeAmount;

        const updated = objects.map(obj => {
          if (obj.id === selectedId) {
            return {
              ...obj,
              x: obj.x + dx,
              y: obj.y + dy
            };
          }
          return obj;
        });
        pushHistory(updated);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [objects, selectedId, activeTool]);

  // Handle Shape Creation & Manipulation
  const getMouseCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getMouseCoords(e);
    let x = coords.x;
    let y = coords.y;

    if (canvasSettings.snapToGrid) {
      x = Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize;
      y = Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize;
    }

    if (activeTool === 'select') {
      // Find top item clicked on
      const clickedItem = [...objects].reverse().find(obj => {
        if (obj.type === 'rectangle' || obj.type === 'image') {
          const w = obj.width || 0;
          const h = obj.height || 0;
          return coords.x >= obj.x && coords.x <= obj.x + w && coords.y >= obj.y && coords.y <= obj.y + h;
        } else if (obj.type === 'circle') {
          const r = obj.radius || 0;
          const dist = Math.sqrt((coords.x - obj.x) ** 2 + (coords.y - obj.y) ** 2);
          return dist <= r;
        } else if (obj.type === 'text') {
          // Approximate hit area
          return coords.x >= obj.x && coords.x <= obj.x + 120 && coords.y >= obj.y - 15 && coords.y <= obj.y + 10;
        } else if (obj.type === 'path') {
          // Simplify: box hit for paths
          return coords.x >= obj.x - 20 && coords.x <= obj.x + 150 && coords.y >= obj.y - 20 && coords.y <= obj.y + 150;
        }
        return false;
      });

      if (clickedItem) {
        setSelectedId(clickedItem.id);
        setIsDragging(true);
        setDragOffset({
          x: coords.x - clickedItem.x,
          y: coords.y - clickedItem.y
        });
      } else {
        setSelectedId(null);
      }
    } else {
      // Start Drawing/Placing shapes
      setIsDrawing(true);
      setStartX(x);
      setStartY(y);

      const newId = `obj-${Date.now()}`;
      setActiveObjectId(newId);

      let newObj: DrawingObject | null = null;

      if (activeTool === 'rectangle') {
        newObj = {
          id: newId,
          type: 'rectangle',
          x,
          y,
          width: 8,
          height: 8,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth
        };
      } else if (activeTool === 'circle') {
        newObj = {
          id: newId,
          type: 'circle',
          x,
          y,
          radius: 4,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth
        };
      } else if (activeTool === 'path') {
        newObj = {
          id: newId,
          type: 'path',
          x,
          y,
          points: `M ${coords.x} ${coords.y}`,
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth
        };
      } else if (activeTool === 'text') {
        newObj = {
          id: newId,
          type: 'text',
          x,
          y,
          text: 'Double click to edit',
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: 1
        };
        setIsDrawing(false); // Immediate text placement
        pushHistory([...objects, newObj]);
        setSelectedId(newId);
        setActiveTool('select');
      } else if (activeTool === 'image') {
        newObj = {
          id: newId,
          type: 'image',
          x,
          y,
          width: 140,
          height: 100,
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
          fill: 'transparent',
          stroke: '#004ac6',
          strokeWidth: 1
        };
        setIsDrawing(false); // Immediate placement
        pushHistory([...objects, newObj]);
        setSelectedId(newId);
        setActiveTool('select');
      }

      if (newObj) {
        setObjects([...objects, newObj]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getMouseCoords(e);
    let x = coords.x;
    let y = coords.y;

    if (canvasSettings.snapToGrid) {
      x = Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize;
      y = Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize;
    }

    if (isDragging && selectedId) {
      const updated = objects.map(obj => {
        if (obj.id === selectedId) {
          let nx = coords.x - dragOffset.x;
          let ny = coords.y - dragOffset.y;
          
          if (canvasSettings.snapToGrid) {
            nx = Math.round(nx / canvasSettings.gridSize) * canvasSettings.gridSize;
            ny = Math.round(ny / canvasSettings.gridSize) * canvasSettings.gridSize;
          }

          return { ...obj, x: nx, y: ny };
        }
        return obj;
      });
      setObjects(updated);
    } else if (isDrawing && activeObjectId) {
      const updated = objects.map(obj => {
        if (obj.id === activeObjectId) {
          if (obj.type === 'rectangle') {
            const w = Math.max(8, Math.abs(x - startX));
            const h = Math.max(8, Math.abs(y - startY));
            const nx = x < startX ? x : startX;
            const ny = y < startY ? y : startY;
            return { ...obj, x: nx, y: ny, width: w, height: h };
          } else if (obj.type === 'circle') {
            const r = Math.max(4, Math.ceil(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)));
            return { ...obj, x: startX, y: startY, radius: r };
          } else if (obj.type === 'path') {
            return { ...obj, points: `${obj.points} L ${coords.x} ${coords.y}` };
          }
        }
        return obj;
      });
      setObjects(updated);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pushHistory(objects); // Commit moves
    } else if (isDrawing) {
      setIsDrawing(false);
      
      // Filter out tiny unformed items
      const activeObj = objects.find(o => o.id === activeObjectId);
      if (activeObj) {
        if (activeObj.type === 'rectangle' && (activeObj.width || 0) <= 8 && (activeObj.height || 0) <= 8) {
          // Click-to-place default Rectangle size
          const updated = objects.map(obj => {
            if (obj.id === activeObjectId) {
              return { ...obj, width: 100, height: 70 };
            }
            return obj;
          });
          pushHistory(updated);
        } else if (activeObj.type === 'circle' && (activeObj.radius || 0) <= 4) {
          // Click-to-place default Circle size
          const updated = objects.map(obj => {
            if (obj.id === activeObjectId) {
              return { ...obj, radius: 40 };
            }
            return obj;
          });
          pushHistory(updated);
        } else {
          pushHistory(objects);
        }
        setSelectedId(activeObjectId);
      }
      setActiveObjectId(null);
      setActiveTool('select');
    }
  };

  // Duplicate element
  const handleDuplicateObject = (id: string) => {
    const original = objects.find(o => o.id === id);
    if (!original) return;

    const copy: DrawingObject = {
      ...original,
      id: `obj-dup-${Date.now()}`,
      x: original.x + 20,
      y: original.y + 20
    };

    const updated = [...objects, copy];
    pushHistory(updated);
    setSelectedId(copy.id);
  };

  // Bring layer to front
  const handleBringToFront = (id: string) => {
    const item = objects.find(o => o.id === id);
    if (!item) return;

    const filtered = objects.filter(o => o.id !== id);
    const updated = [...filtered, item];
    pushHistory(updated);
  };

  // Send layer to back
  const handleSendToBack = (id: string) => {
    const item = objects.find(o => o.id === id);
    if (!item) return;

    const filtered = objects.filter(o => o.id !== id);
    const updated = [item, ...filtered];
    pushHistory(updated);
  };

  // Delete element
  const handleDeleteObject = (id: string) => {
    const updated = objects.filter(o => o.id !== id);
    pushHistory(updated);
    setSelectedId(null);
  };

  // Update properties of selected element
  const updateSelectedProperty = <K extends keyof DrawingObject>(key: K, value: DrawingObject[K]) => {
    if (!selectedId) return;

    const updated = objects.map(obj => {
      if (obj.id === selectedId) {
        return {
          ...obj,
          [key]: value
        };
      }
      return obj;
    });

    setObjects(updated);
    
    // Throttle history save slightly for smooth slider experiences
    onSaveDrawing({
      ...drawing,
      objects: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handlePropertyChangeComplete = () => {
    pushHistory(objects);
  };

  // Get current selected object details
  const selectedObject = objects.find(o => o.id === selectedId);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-on-background font-sans select-none overflow-hidden antialiased">
      
      {/* Dynamic Top Workspace Navigation Bar */}
      <header className="h-[52px] bg-surface-bright border-b border-outline-variant/40 flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-surface-container rounded-lg text-secondary hover:text-on-surface transition-colors cursor-pointer"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          
          <div className="w-px h-5 bg-outline-variant/40"></div>
          
          <img
            alt="DrawOS Mini Logo"
            className="w-5.5 h-5.5 rounded"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QXkxy3sALdb0x34RktvYkaT9WCSYexYdwzjaq3puW41PwiPRxGfNpmVhwQgw2yGRMvgaPM93bzsB0rGdXewfzjdfO-SLdD6QEMjKUgYqGPcOT8hYrbxpSqFU5dCqwTxD0IV9W_5yp7pX6LJ40VWYlbPDwBCJZJ7OqFaVqa7hjFX2MQJHpOyx_EY_MrC_Eb-UxAcFQhCwN2hUvjqdQc8qzGXQ9AQ7K1oih6hv1IKklWiXv3uT-1AHGoLjmyReV517OFaGB2ZD9OIa"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-tight text-on-surface leading-none">{drawing.name}</span>
            <span className="text-[9px] text-secondary font-mono leading-none mt-0.5">Workspace</span>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-2">
          
          {/* History */}
          <button
            onClick={handleUndo}
            disabled={historyPast.length === 0}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              historyPast.length === 0 ? 'text-outline-variant cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-surface-container'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={historyFuture.length === 0}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              historyFuture.length === 0 ? 'text-outline-variant cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-surface-container'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-outline-variant/40 mx-1"></div>

          {/* Quick Config Modals */}
          <button
            onClick={onOpenCommandPalette}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-secondary font-mono hidden sm:inline">Ctrl+K</span>
          </button>

          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Key Bindings"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="Grid Options"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAbout}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title="About Engine"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-outline-variant/40 mx-1"></div>

          {/* Export Action */}
          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Draft
          </button>
        </div>
      </header>

      {/* Main Workspace split panel */}
      <div className="flex-grow flex w-full relative overflow-hidden">
        
        {/* LEFT TOOL SIDEBAR (Floating floating toolbar vertical) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md">
          
          {/* Tool select button */}
          <button
            onClick={() => { setActiveTool('select'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'select'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Pointer / Select shape (V)"
          >
            <MousePointer className="w-4.5 h-4.5" />
          </button>

          {/* Rect button */}
          <button
            onClick={() => { setActiveTool('rectangle'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'rectangle'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Rectangle Tool (R)"
          >
            <Square className="w-4.5 h-4.5" />
          </button>

          {/* Circle button */}
          <button
            onClick={() => { setActiveTool('circle'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'circle'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Circle Tool (O)"
          >
            <Circle className="w-4.5 h-4.5" />
          </button>

          {/* Path Pen tool */}
          <button
            onClick={() => { setActiveTool('path'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'path'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Pen / Path Draw (P)"
          >
            <PenTool className="w-4.5 h-4.5" />
          </button>

          {/* Text tool */}
          <button
            onClick={() => { setActiveTool('text'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'text'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Text Tool (T)"
          >
            <Type className="w-4.5 h-4.5" />
          </button>

          {/* Image Layer Tool */}
          <button
            onClick={() => { setActiveTool('image'); setSelectedId(null); }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              activeTool === 'image'
                ? 'bg-primary text-on-primary shadow-sm scale-105'
                : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
            title="Place Image (I)"
          >
            <ImageIcon className="w-4.5 h-4.5" />
          </button>

          <div className="w-6 h-[1px] bg-outline-variant/40 my-1"></div>

          {/* Clear canvas layout */}
          <button
            onClick={() => {
              if (confirm('Clear entire drawing board?')) {
                pushHistory([]);
                setSelectedId(null);
              }
            }}
            className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container/20 transition-all cursor-pointer"
            title="Clear drawing space"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* WORKSPACE CENTRAL CANVA */}
        <div className="flex-grow h-full relative overflow-hidden bg-background">
          {/* Active Canvas Settings Details overlay top-left */}
          <div className="absolute top-4 left-20 z-20 pointer-events-none flex flex-col font-mono text-[9px] text-secondary gap-0.5">
            <span className="flex items-center gap-1 bg-surface-bright/70 border border-outline-variant/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
              <span className={`w-1 h-1 rounded-full ${canvasSettings.snapToGrid ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              GRID: {canvasSettings.gridSize}px ({canvasSettings.snapToGrid ? 'SNAPPING' : 'FREEFORM'})
            </span>
            <span className="flex items-center gap-1 bg-surface-bright/70 border border-outline-variant/30 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm mt-1">
              ELEMENTS: {objects.length}
            </span>
          </div>

          <div className="w-full h-full relative p-2 overflow-auto">
            {/* SVG STAGE */}
            <svg
              ref={svgRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`w-full h-full min-h-[600px] border border-outline-variant/40 rounded-xl relative shadow-inner overflow-hidden cursor-crosshair transition-all ${
                canvasSettings.transparentBackground ? 'checkerboard-bg' : 'bg-surface-bright'
              }`}
              style={{
                '--grid-size-pattern': `${canvasSettings.gridSize}px`,
              } as React.CSSProperties}
            >
              {/* Grid Background Pattern */}
              {canvasSettings.showGrid && (
                <rect width="100%" height="100%" fill="transparent" className="bg-grid-pattern pointer-events-none" />
              )}

              {/* DRAWN VECTOR ELEMENTS */}
              {objects.map((obj) => {
                const isSelected = obj.id === selectedId;
                
                return (
                  <g key={obj.id}>
                    {obj.type === 'rectangle' && (
                      <rect
                        x={obj.x}
                        y={obj.y}
                        width={obj.width || 0}
                        height={obj.height || 0}
                        fill={obj.fill}
                        stroke={obj.stroke}
                        strokeWidth={obj.strokeWidth}
                        rx="4"
                      />
                    )}

                    {obj.type === 'circle' && (
                      <circle
                        cx={obj.x}
                        cy={obj.y}
                        r={obj.radius || 0}
                        fill={obj.fill}
                        stroke={obj.stroke}
                        strokeWidth={obj.strokeWidth}
                      />
                    )}

                    {obj.type === 'path' && (
                      <path
                        d={obj.points || ''}
                        fill="transparent"
                        stroke={obj.stroke}
                        strokeWidth={obj.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {obj.type === 'text' && (
                      <text
                        x={obj.x}
                        y={obj.y}
                        fill={obj.stroke === 'transparent' ? '#000000' : obj.stroke}
                        fontFamily="Geist, sans-serif"
                        fontSize="16"
                        fontWeight="500"
                        dominantBaseline="middle"
                        pointerEvents="auto"
                      >
                        {obj.text || ''}
                      </text>
                    )}

                    {obj.type === 'image' && (
                      <image
                        x={obj.x}
                        y={obj.y}
                        width={obj.width || 0}
                        height={obj.height || 0}
                        href={obj.imageUrl || ''}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    )}

                    {/* Active object visual outline bound highlight */}
                    {isSelected && (
                      <>
                        {/* Box layout for Rect / Images */}
                        {(obj.type === 'rectangle' || obj.type === 'image') && (
                          <rect
                            x={obj.x - 2}
                            y={obj.y - 2}
                            width={(obj.width || 0) + 4}
                            height={(obj.height || 0) + 4}
                            fill="none"
                            stroke="#004ac6"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                          />
                        )}

                        {/* Circular layout for circles */}
                        {obj.type === 'circle' && (
                          <circle
                            cx={obj.x}
                            cy={obj.y}
                            r={(obj.radius || 0) + 3}
                            fill="none"
                            stroke="#004ac6"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                          />
                        )}

                        {/* Text bounding helper */}
                        {obj.type === 'text' && (
                          <rect
                            x={obj.x - 4}
                            y={obj.y - 14}
                            width={130}
                            height={25}
                            fill="none"
                            stroke="#004ac6"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                        )}

                        {/* Path selector box outline approximate */}
                        {obj.type === 'path' && (
                          <rect
                            x={obj.x - 10}
                            y={obj.y - 10}
                            width={140}
                            height={140}
                            fill="none"
                            stroke="#004ac6"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT PROPERTY INSPECTOR SIDEBAR */}
        <aside className="w-[280px] h-full bg-surface-bright border-l border-outline-variant/40 shrink-0 z-20 flex flex-col overflow-y-auto custom-scrollbar">
          
          {/* Top segment: File detail */}
          <div className="p-4 border-b border-outline-variant/30 space-y-3.5">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Document Specifications</span>
            
            <div className="space-y-1">
              <label className="text-[10px] text-secondary font-medium block">Drawing Name</label>
              <input
                type="text"
                value={drawing.name}
                onChange={(e) => {
                  onSaveDrawing({
                    ...drawing,
                    name: e.target.value,
                    updatedAt: new Date().toISOString()
                  });
                }}
                className="w-full text-xs font-semibold bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary outline-none px-3 py-1.5 rounded text-on-surface transition-colors"
                placeholder="Drawing Title"
              />
            </div>

            {/* Quick Toggle snaps */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-on-surface font-medium">Grid Alignment Snap</span>
              <button
                onClick={() => onChangeSettings({ ...canvasSettings, snapToGrid: !canvasSettings.snapToGrid })}
                className={`w-9 h-5 rounded-full transition-all duration-200 cursor-pointer relative ${
                  canvasSettings.snapToGrid ? 'bg-primary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${
                    canvasSettings.snapToGrid ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Middle Segment: Element property Editor */}
          <div className="flex-grow p-4 space-y-6">
            {!selectedObject ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-outline-variant/50 rounded-lg">
                <MousePointer className="w-8 h-8 text-outline-variant mb-3" />
                <span className="text-xs font-bold text-on-surface mb-1">No Selection</span>
                <p className="text-[10px] text-secondary leading-relaxed">
                  Click a vector shape on the stage, or select a shape tool above to start placing geometry layers.
                </p>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Properties: {selectedObject.type}</span>
                  <span className="text-[9px] font-mono font-bold text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded uppercase">
                    Selected
                  </span>
                </div>

                {/* Text Layer content edit */}
                {selectedObject.type === 'text' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary font-semibold block">Text Display Content</label>
                    <input
                      type="text"
                      value={selectedObject.text || ''}
                      onChange={(e) => updateSelectedProperty('text', e.target.value)}
                      className="w-full text-xs bg-surface border border-outline-variant hover:border-outline focus:border-primary outline-none px-2.5 py-1.5 rounded text-on-surface"
                    />
                  </div>
                )}

                {/* Image URL content edit */}
                {selectedObject.type === 'image' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-secondary font-semibold block">Source Image URL</label>
                    <input
                      type="text"
                      value={selectedObject.imageUrl || ''}
                      onChange={(e) => updateSelectedProperty('imageUrl', e.target.value)}
                      className="w-full text-[10px] font-mono bg-surface border border-outline-variant hover:border-outline focus:border-primary outline-none px-2.5 py-1.5 rounded text-on-surface"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                )}

                {/* Colors controls */}
                {selectedObject.type !== 'path' && selectedObject.type !== 'text' && selectedObject.type !== 'image' && (
                  <div className="space-y-3">
                    <label className="text-[10px] text-secondary font-semibold block">Fill Color</label>
                    
                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-2">
                      {presetColors.map((col, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            updateSelectedProperty('fill', col.value);
                            pushHistory(objects);
                          }}
                          className={`w-full aspect-square rounded border relative cursor-pointer ${
                            selectedObject.fill === col.value ? 'ring-2 ring-primary ring-offset-2' : 'border-outline-variant/60'
                          }`}
                          style={{ backgroundColor: col.value }}
                          title={col.name}
                        >
                          {col.value === 'transparent' && (
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-[9px] text-rose-500">
                              /
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Hex Fill */}
                    <input
                      type="text"
                      value={selectedObject.fill}
                      onChange={(e) => updateSelectedProperty('fill', e.target.value)}
                      onBlur={handlePropertyChangeComplete}
                      className="w-full text-xs font-mono bg-surface border border-outline-variant px-2 py-1 rounded"
                    />
                  </div>
                )}

                {/* Stroke Color control */}
                <div className="space-y-3">
                  <label className="text-[10px] text-secondary font-semibold block">Stroke Color</label>
                  
                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {presetColors.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          updateSelectedProperty('stroke', col.value);
                          pushHistory(objects);
                        }}
                        className={`w-full aspect-square rounded border relative cursor-pointer ${
                          selectedObject.stroke === col.value ? 'ring-2 ring-primary ring-offset-2' : 'border-outline-variant/60'
                        }`}
                        style={{ backgroundColor: col.value }}
                        title={col.name}
                      >
                        {col.value === 'transparent' && (
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-[9px] text-rose-500">
                            /
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Stroke */}
                  <input
                    type="text"
                    value={selectedObject.stroke}
                    onChange={(e) => updateSelectedProperty('stroke', e.target.value)}
                    onBlur={handlePropertyChangeComplete}
                    className="w-full text-xs font-mono bg-surface border border-outline-variant px-2 py-1 rounded"
                  />
                </div>

                {/* Dimension Dimensions parameters */}
                <div className="space-y-4 pt-1 border-t border-outline-variant/20">
                  
                  {/* Stroke Width Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-secondary">
                      <span>Stroke Thickness</span>
                      <span className="font-mono font-semibold">{selectedObject.strokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={selectedObject.strokeWidth}
                      onChange={(e) => updateSelectedProperty('strokeWidth', parseInt(e.target.value))}
                      onMouseUp={handlePropertyChangeComplete}
                      className="w-full accent-primary h-1 rounded bg-outline-variant/40"
                    />
                  </div>

                  {/* Rectangle Width Slider */}
                  {(selectedObject.type === 'rectangle' || selectedObject.type === 'image') && (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-secondary">
                          <span>Width</span>
                          <span className="font-mono font-semibold">{selectedObject.width || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="400"
                          value={selectedObject.width || 10}
                          onChange={(e) => updateSelectedProperty('width', parseInt(e.target.value))}
                          onMouseUp={handlePropertyChangeComplete}
                          className="w-full accent-primary h-1 rounded bg-outline-variant/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-secondary">
                          <span>Height</span>
                          <span className="font-mono font-semibold">{selectedObject.height || 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="400"
                          value={selectedObject.height || 10}
                          onChange={(e) => updateSelectedProperty('height', parseInt(e.target.value))}
                          onMouseUp={handlePropertyChangeComplete}
                          className="w-full accent-primary h-1 rounded bg-outline-variant/40"
                        />
                      </div>
                    </>
                  )}

                  {/* Circle Radius Slider */}
                  {selectedObject.type === 'circle' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-secondary">
                        <span>Radius Size</span>
                        <span className="font-mono font-semibold">{selectedObject.radius || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        value={selectedObject.radius || 5}
                        onChange={(e) => updateSelectedProperty('radius', parseInt(e.target.value))}
                        onMouseUp={handlePropertyChangeComplete}
                        className="w-full accent-primary h-1 rounded bg-outline-variant/40"
                      />
                    </div>
                  )}

                </div>

                {/* Layer Sorting and Actions */}
                <div className="space-y-2 pt-3 border-t border-outline-variant/20">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Layer Ordering</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleBringToFront(selectedObject.id)}
                      className="py-2 border border-outline-variant hover:border-outline bg-transparent rounded-lg text-[10px] font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Bring element to the front stack"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                      Bring Front
                    </button>
                    <button
                      onClick={() => handleSendToBack(selectedObject.id)}
                      className="py-2 border border-outline-variant hover:border-outline bg-transparent rounded-lg text-[10px] font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Send element to the back stack"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                      Send Back
                    </button>
                  </div>

                  <button
                    onClick={() => handleDuplicateObject(selectedObject.id)}
                    className="w-full py-2 border border-outline-variant hover:border-outline bg-transparent rounded-lg text-[10px] font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate Element
                  </button>

                  <button
                    onClick={() => handleDeleteObject(selectedObject.id)}
                    className="w-full py-2 bg-error-container/20 hover:bg-error-container/40 border border-error/20 hover:border-error/40 text-error rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Element
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick status bar */}
          <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 text-[9px] font-mono text-secondary flex items-center justify-between mt-auto">
            <span>COORDS: {selectedObject ? `${Math.round(selectedObject.x)}, ${Math.round(selectedObject.y)}` : 'N/A'}</span>
            <span>GRID: {canvasSettings.gridSize}px</span>
          </div>

        </aside>

      </div>
    </div>
  );
}
