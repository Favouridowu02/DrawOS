import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, RotateCw, Settings, Keyboard, Sparkles, 
  Square, Circle, Type, Eye, EyeOff, Lock, Unlock, Trash2, Sliders, Play, 
  Undo, Redo, Command, Copy, MoveUp, MoveDown, Image as ImageIcon,
  FolderOpen, MousePointer, PenTool, Check, Download,
  Plus, Minus, Maximize2, ChevronLeft, ChevronRight,
  GripVertical, GripHorizontal, Anchor, LayoutTemplate
} from 'lucide-react';
import { ToolType, DrawingObject, Drawing, CanvasSettings } from '@/src/types';
import { snap, isPointInRect, isPointInCircle } from '@drawos/geometry';
import { Viewport, screenToWorld, zoomAtScreenPoint } from '@drawos/camera';

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
  isModalOpen?: boolean;
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
  onOpenCommandPalette,
  isModalOpen = false
}: MainEditorProps) {
  // State from drawing object
  const [objects, setObjects] = useState<DrawingObject[]>(drawing.objects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('select');

  useEffect(() => {
    setObjects(drawing.objects);
  }, [drawing.id]);

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasDraggedRef = useRef(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Viewport zoom & pan state
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Layers Sidebar states (Grida/Figma inspiration)
  const [showLayers, setShowLayers] = useState(true);
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Toolbar position and docking states
  const [toolbarDock, setToolbarDock] = useState<'left' | 'right' | 'top' | 'bottom' | 'float'>('left');
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number, y: number }>({ x: 280, y: 150 });
  const [toolbarOrientation, setToolbarOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [showDockMenu, setShowDockMenu] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleToolbarDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingToolbar(true);
    
    let startX = toolbarPosition.x;
    let startY = toolbarPosition.y;
    
    if (toolbarRef.current) {
      const rect = toolbarRef.current.getBoundingClientRect();
      const parent = toolbarRef.current.offsetParent as HTMLElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        startX = rect.left - parentRect.left;
        startY = rect.top - parentRect.top;
      }
    }
    
    dragStartPos.current = {
      x: e.clientX - startX,
      y: e.clientY - startY
    };
    
    if (toolbarDock !== 'float') {
      setToolbarDock('float');
      setToolbarPosition({ x: startX, y: startY });
    }
  };

  useEffect(() => {
    if (!isDraggingToolbar) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (toolbarRef.current) {
        const parent = toolbarRef.current.offsetParent as HTMLElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          let newX = e.clientX - dragStartPos.current.x;
          let newY = e.clientY - dragStartPos.current.y;
          
          const rect = toolbarRef.current.getBoundingClientRect();
          const maxX = parentRect.width - rect.width - 16;
          const maxY = parentRect.height - rect.height - 16;
          
          newX = Math.max(16, Math.min(newX, maxX));
          newY = Math.max(16, Math.min(newY, maxY));
          
          setToolbarPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDraggingToolbar(false);
      
      if (toolbarRef.current) {
        const parent = toolbarRef.current.offsetParent as HTMLElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const currentX = e.clientX - dragStartPos.current.x;
          const currentY = e.clientY - dragStartPos.current.y;
          const rect = toolbarRef.current.getBoundingClientRect();
          
          const snapThreshold = 90; // Pixels from edge to snap dock
          
          if (currentX < snapThreshold) {
            setToolbarDock('left');
            setToolbarOrientation('vertical');
          } else if (currentX > parentRect.width - rect.width - snapThreshold) {
            setToolbarDock('right');
            setToolbarOrientation('vertical');
          } else if (currentY < snapThreshold) {
            setToolbarDock('top');
            setToolbarOrientation('horizontal');
          } else if (currentY > parentRect.height - rect.height - snapThreshold) {
            setToolbarDock('bottom');
            setToolbarOrientation('horizontal');
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingToolbar]);

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

      // Ignore keydown if a modal is open, or if we are actively editing text/renaming a layer
      if (isModalOpen || editingTextId || renamingLayerId) {
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
        const targetObj = objects.find(o => o.id === selectedId);
        if (targetObj?.locked) return;
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
  }, [objects, selectedId, activeTool, isModalOpen, editingTextId, renamingLayerId]);

  // Listen for space key and wheel zooming
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);

    const svgEl = svgRef.current;
    if (!svgEl) {
      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
        window.removeEventListener('keyup', handleGlobalKeyUp);
      };
    }

    const handleSvgWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svgEl.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setViewport(prev => zoomAtScreenPoint(sx, sy, prev, zoomFactor, 0.15, 8.0));
    };

    svgEl.addEventListener('wheel', handleSvgWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
      svgEl.removeEventListener('wheel', handleSvgWheel);
    };
  }, []);

  // Handle Shape Creation & Manipulation
  const getMouseCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    return screenToWorld(sx, sy, viewport);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      e.preventDefault();
      return;
    }

    const coords = getMouseCoords(e);
    let x = snap(coords.x, canvasSettings.gridSize, canvasSettings.snapToGrid);
    let y = snap(coords.y, canvasSettings.gridSize, canvasSettings.snapToGrid);

    if (activeTool === 'select') {
      // Find top item clicked on
      const clickedItem = [...objects].reverse().find(obj => {
        if (obj.visible === false || obj.locked === true) return false;
        if (obj.type === 'rectangle' || obj.type === 'image') {
          const w = obj.width || 0;
          const h = obj.height || 0;
          return isPointInRect(coords.x, coords.y, obj.x, obj.y, w, h);
        } else if (obj.type === 'circle') {
          const r = obj.radius || 0;
          return isPointInCircle(coords.x, coords.y, obj.x, obj.y, r);
        } else if (obj.type === 'text') {
          // Approximate hit area
          return isPointInRect(coords.x, coords.y, obj.x, obj.y - 15, 120, 25);
        } else if (obj.type === 'path') {
          // Simplify: box hit for paths
          return isPointInRect(coords.x, coords.y, obj.x - 20, obj.y - 20, 170, 170);
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
    if (isPanning) {
      setViewport({
        ...viewport,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    const coords = getMouseCoords(e);
    let x = snap(coords.x, canvasSettings.gridSize, canvasSettings.snapToGrid);
    let y = snap(coords.y, canvasSettings.gridSize, canvasSettings.snapToGrid);

    if (isDragging && selectedId) {
      hasDraggedRef.current = true;
      const updated = objects.map(obj => {
        if (obj.id === selectedId) {
          let nx = snap(coords.x - dragOffset.x, canvasSettings.gridSize, canvasSettings.snapToGrid);
          let ny = snap(coords.y - dragOffset.y, canvasSettings.gridSize, canvasSettings.snapToGrid);

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
            const r = Math.max(4, Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)));
            return { ...obj, radius: r };
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
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDragging) {
      setIsDragging(false);
      if (hasDraggedRef.current) {
        pushHistory(objects); // Commit moves
        hasDraggedRef.current = false;
      }
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

  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getMouseCoords(e);
    const clickedItem = [...objects].reverse().find(obj => {
      if (obj.visible === false || obj.locked === true) return false;
      if (obj.type === 'rectangle' || obj.type === 'image') {
        const w = obj.width || 0;
        const h = obj.height || 0;
        return isPointInRect(coords.x, coords.y, obj.x, obj.y, w, h);
      } else if (obj.type === 'circle') {
        const r = obj.radius || 0;
        return isPointInCircle(coords.x, coords.y, obj.x, obj.y, r);
      } else if (obj.type === 'text') {
        return isPointInRect(coords.x, coords.y, obj.x, obj.y - 15, 120, 25);
      } else if (obj.type === 'path') {
        return isPointInRect(coords.x, coords.y, obj.x - 20, obj.y - 20, 170, 170);
      }
      return false;
    });

    if (clickedItem) {
      setSelectedId(clickedItem.id);
      if (clickedItem.type === 'text') {
        setEditingTextId(clickedItem.id);
      }
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (selectedId && selectedObject?.type === 'image') {
        updateSelectedProperty('imageUrl', dataUrl);
        pushHistory(objects.map(o => o.id === selectedId ? { ...o, imageUrl: dataUrl } : o));
      } else {
        const svgWidth = svgRef.current ? svgRef.current.clientWidth : 800;
        const svgHeight = svgRef.current ? svgRef.current.clientHeight : 600;
        const coords = screenToWorld(svgWidth / 2, svgHeight / 2, viewport);
        let x = snap(coords.x, canvasSettings.gridSize, canvasSettings.snapToGrid);
        let y = snap(coords.y, canvasSettings.gridSize, canvasSettings.snapToGrid);

        const newId = `obj-${Date.now()}`;
        const newObj: DrawingObject = {
          id: newId,
          type: 'image',
          x,
          y,
          width: 200,
          height: 150,
          imageUrl: dataUrl,
          fill: 'transparent',
          stroke: '#004ac6',
          strokeWidth: 1
        };
        const updated = [...objects, newObj];
        pushHistory(updated);
        setSelectedId(newId);
        setActiveTool('select');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const coords = screenToWorld(sx, sy, viewport);
        let x = snap(coords.x, canvasSettings.gridSize, canvasSettings.snapToGrid);
        let y = snap(coords.y, canvasSettings.gridSize, canvasSettings.snapToGrid);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const newId = `obj-${Date.now()}`;
          const newObj: DrawingObject = {
            id: newId,
            type: 'image',
            x,
            y,
            width: 200,
            height: 150,
            imageUrl: dataUrl,
            fill: 'transparent',
            stroke: '#004ac6',
            strokeWidth: 1
          };
          const updated = [...objects, newObj];
          pushHistory(updated);
          setSelectedId(newId);
          setActiveTool('select');
        };
        reader.readAsDataURL(file);
      }
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
  const updateSelectedProperty = <K extends keyof DrawingObject>(
    key: K, 
    value: DrawingObject[K], 
    recordHistory = false
  ) => {
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

    if (recordHistory) {
      pushHistory(updated);
    } else {
      setObjects(updated);
      onSaveDrawing({
        ...drawing,
        objects: updated,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handlePropertyChangeComplete = () => {
    // Keep current objects synced in history
    setHistoryPast(prev => [...prev, objects]);
    setHistoryFuture([]);
  };

  // Grida inspired layer actions
  const toggleLayerVisibility = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = objects.map(obj => {
      if (obj.id === id) {
        return { ...obj, visible: obj.visible === false ? true : false };
      }
      return obj;
    });
    pushHistory(updated);
    if (selectedId === id && updated.find(o => o.id === id)?.visible === false) {
      setSelectedId(null);
    }
  };

  const toggleLayerLock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = objects.map(obj => {
      if (obj.id === id) {
        return { ...obj, locked: !obj.locked };
      }
      return obj;
    });
    pushHistory(updated);
  };

  const moveLayerIndex = (id: string, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    const index = objects.findIndex(o => o.id === id);
    if (index === -1) return;

    const updated = [...objects];
    if (direction === 'up' && index < objects.length - 1) {
      // Move up (toward higher rendering order index)
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      pushHistory(updated);
    } else if (direction === 'down' && index > 0) {
      // Move down (toward lower rendering order index)
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      pushHistory(updated);
    }
  };

  const startRenameLayer = (id: string, currentName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRenamingLayerId(id);
    setRenameValue(currentName);
  };

  const completeRenameLayer = (id: string) => {
    const updated = objects.map(obj => {
      if (obj.id === id) {
        return { ...obj, name: renameValue.trim() || undefined };
      }
      return obj;
    });
    pushHistory(updated);
    setRenamingLayerId(null);
  };

  const getCursorClass = () => {
    if (isSpacePressed) {
      return isPanning ? 'grabbing' : 'grab';
    }
    if (activeTool === 'select') {
      return isDragging ? 'grabbing' : 'default';
    }
    return 'crosshair';
  };

  // Get current selected object details
  const selectedObject = objects.find(o => o.id === selectedId);

  const getToolbarLayout = () => {
    switch (toolbarDock) {
      case 'left':
        return {
          className: 'absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300',
          style: {},
          orientation: 'vertical' as const
        };
      case 'right':
        return {
          className: 'absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300',
          style: {},
          orientation: 'vertical' as const
        };
      case 'top':
        return {
          className: 'absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-row items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300',
          style: {},
          orientation: 'horizontal' as const
        };
      case 'bottom':
        return {
          className: 'absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-row items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300',
          style: {},
          orientation: 'horizontal' as const
        };
      case 'float':
        return {
          className: `absolute z-30 flex items-center gap-1.5 bg-surface-bright/95 border border-outline-variant/60 p-1.5 rounded-xl shadow-lg backdrop-blur-md ${isDraggingToolbar ? 'select-none cursor-grabbing border-primary/80 ring-4 ring-primary/25' : ''}`,
          style: {
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            flexDirection: toolbarOrientation === 'vertical' ? 'column' : 'row'
          },
          orientation: toolbarOrientation
        };
    }
  };

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
            className="w-5.5 h-5.5 rounded object-contain"
            src="/apps/web/drawos.png"
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
        
        {/* DRAGGABLE & DOCKABLE TOOLBAR */}
        {(() => {
          const layout = getToolbarLayout();
          return (
            <div
              ref={toolbarRef}
              className={layout.className}
              style={layout.style}
              id="drawos-dockable-toolbar"
            >
              {/* Drag handle */}
              <div
                onMouseDown={handleToolbarDragStart}
                className={`p-1 text-secondary hover:text-on-surface cursor-grab active:cursor-grabbing rounded transition-colors ${
                  isDraggingToolbar ? 'text-primary' : ''
                }`}
                title="Drag to float & move. Drop near any screen edge to dock!"
              >
                {layout.orientation === 'vertical' ? (
                  <GripHorizontal className="w-4 h-4 opacity-70" />
                ) : (
                  <GripVertical className="w-4 h-4 opacity-70" />
                )}
              </div>

              <div className={layout.orientation === 'vertical' ? "w-6 h-[1px] bg-outline-variant/40 my-0.5" : "h-6 w-[1px] bg-outline-variant/40 mx-0.5"}></div>

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

              <div className={layout.orientation === 'vertical' ? "w-6 h-[1px] bg-outline-variant/40 my-0.5" : "h-6 w-[1px] bg-outline-variant/40 mx-0.5"}></div>

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

              <div className={layout.orientation === 'vertical' ? "w-6 h-[1px] bg-outline-variant/40 my-0.5" : "h-6 w-[1px] bg-outline-variant/40 mx-0.5"}></div>

              {/* Docking Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowDockMenu(!showDockMenu)}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    showDockMenu || toolbarDock !== 'left'
                      ? 'bg-secondary/15 text-on-surface'
                      : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                  title="Toolbar docking & layout settings"
                >
                  <LayoutTemplate className="w-4.5 h-4.5" />
                </button>

                {/* Dock Menu Popover */}
                {showDockMenu && (
                  <div 
                    className={`absolute z-50 bg-surface-bright border border-outline-variant/60 p-2 rounded-xl shadow-xl backdrop-blur-md flex flex-col gap-1 min-w-[140px] text-xs font-medium animate-fade-in ${
                      layout.orientation === 'vertical' 
                        ? 'left-full ml-2 -top-10' 
                        : 'bottom-full mb-2 -left-12'
                    }`}
                  >
                    <div className="text-[10px] text-secondary/70 px-2 py-0.5 font-bold uppercase tracking-wider">
                      Dock Position
                    </div>
                    
                    <button
                      onClick={() => { setToolbarDock('left'); setToolbarOrientation('vertical'); setShowDockMenu(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                        toolbarDock === 'left' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Dock Left
                    </button>
                    
                    <button
                      onClick={() => { setToolbarDock('right'); setToolbarOrientation('vertical'); setShowDockMenu(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                        toolbarDock === 'right' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Dock Right
                    </button>
                    
                    <button
                      onClick={() => { setToolbarDock('top'); setToolbarOrientation('horizontal'); setShowDockMenu(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                        toolbarDock === 'top' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Dock Top
                    </button>
                    
                    <button
                      onClick={() => { setToolbarDock('bottom'); setToolbarOrientation('horizontal'); setShowDockMenu(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                        toolbarDock === 'bottom' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Dock Bottom
                    </button>
                    
                    <button
                      onClick={() => { setToolbarDock('float'); setShowDockMenu(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                        toolbarDock === 'float' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Free Float
                    </button>

                    {toolbarDock === 'float' && (
                      <>
                        <div className="w-full h-[1px] bg-outline-variant/30 my-1"></div>
                        <div className="text-[10px] text-secondary/70 px-2 py-0.5 font-bold uppercase tracking-wider">
                          Orientation
                        </div>
                        <button
                          onClick={() => { setToolbarOrientation('vertical'); setShowDockMenu(false); }}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                            toolbarOrientation === 'vertical' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                          }`}
                        >
                          Vertical
                        </button>
                        <button
                          onClick={() => { setToolbarOrientation('horizontal'); setShowDockMenu(false); }}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors ${
                            toolbarOrientation === 'horizontal' ? 'text-primary bg-primary/10' : 'text-secondary hover:text-on-surface'
                          }`}
                        >
                          Horizontal
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* COLLAPSED LAYERS PANEL TOGGLE HANDLE */}
        {!showLayers && (
          <button
            onClick={() => setShowLayers(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-surface border-y border-r border-outline-variant/60 py-4 px-1 rounded-r-xl shadow-md hover:bg-surface-container transition-colors cursor-pointer"
            title="Show Layers Hierarchy"
          >
            <ChevronRight className="w-3.5 h-3.5 text-secondary" />
          </button>
        )}

        {/* LEFT HIERARCHICAL LAYERS PANEL (Grida/Figma inspiration) */}
        {showLayers && (
          <div className="w-64 shrink-0 bg-surface-bright border-r border-outline-variant/45 flex flex-col h-full z-20 relative select-none animate-fade-in">
            <div className="p-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-bright/50">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Layers Hierarchy</span>
              </div>
              <button
                onClick={() => setShowLayers(false)}
                className="p-1 hover:bg-surface-container rounded transition-colors text-secondary hover:text-on-surface cursor-pointer"
                title="Collapse Layers Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {objects.length === 0 ? (
                <div className="text-center py-12 px-3 border border-dashed border-outline-variant/40 rounded-lg">
                  <span className="text-[10px] font-medium text-secondary block">No layers created yet.</span>
                  <span className="text-[9px] text-secondary/70 block mt-1">Select a drawing tool to place shapes.</span>
                </div>
              ) : (
                [...objects].reverse().map((obj, revIdx) => {
                  const actualIdx = objects.length - 1 - revIdx;
                  const isSelected = obj.id === selectedId;
                  const defaultName = `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} Layer`;
                  const displayName = obj.name || defaultName;

                  return (
                    <div
                      key={obj.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveTool('select');
                        setSelectedId(obj.id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTool('select');
                        setSelectedId(obj.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(obj.id);
                        if (svgRef.current) {
                          const svgWidth = svgRef.current.clientWidth;
                          const svgHeight = svgRef.current.clientHeight;
                          let cx = obj.x;
                          let cy = obj.y;
                          if (obj.type === 'rectangle' || obj.type === 'image') {
                            cx = obj.x + (obj.width || 0) / 2;
                            cy = obj.y + (obj.height || 0) / 2;
                          } else if (obj.type === 'circle') {
                            cx = obj.x;
                            cy = obj.y;
                          } else if (obj.type === 'text') {
                            cx = obj.x + 60;
                            cy = obj.y;
                          }
                          setViewport(prev => ({
                            ...prev,
                            x: svgWidth / 2 - prev.zoom * cx,
                            y: svgHeight / 2 - prev.zoom * cy
                          }));
                        }
                      }}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-lg transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-primary/5 border-primary/20 text-on-surface' 
                          : 'hover:bg-surface-container/60 border-transparent text-secondary hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-grow">
                        {/* Type Icon */}
                        <div className="shrink-0 text-secondary">
                          {obj.type === 'rectangle' && <Square className="w-3.5 h-3.5" />}
                          {obj.type === 'circle' && <Circle className="w-3.5 h-3.5" />}
                          {obj.type === 'path' && <PenTool className="w-3.5 h-3.5" />}
                          {obj.type === 'text' && <Type className="w-3.5 h-3.5" />}
                          {obj.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                        </div>

                        {/* Editable Name Label */}
                        {renamingLayerId === obj.id ? (
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => completeRenameLayer(obj.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') completeRenameLayer(obj.id);
                              if (e.key === 'Escape') setRenamingLayerId(null);
                            }}
                            autoFocus
                            className="text-xs bg-surface border border-primary/40 outline-none px-1 rounded text-on-surface w-full max-w-[120px]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span 
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startRenameLayer(obj.id, displayName, e);
                            }}
                            className="text-xs font-medium truncate select-none"
                            title="Double-click to rename layer"
                          >
                            {displayName}
                          </span>
                        )}
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        {/* Visibility toggler */}
                        <button
                          onClick={(e) => toggleLayerVisibility(obj.id, e)}
                          className="p-1 hover:bg-surface-container rounded text-secondary hover:text-on-surface"
                          title={obj.visible === false ? 'Show layer' : 'Hide layer'}
                        >
                          {obj.visible === false ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Lock toggler */}
                        <button
                          onClick={(e) => toggleLayerLock(obj.id, e)}
                          className={`p-1 hover:bg-surface-container rounded ${obj.locked ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
                          title={obj.locked ? 'Unlock layer positioning' : 'Lock layer positioning'}
                        >
                          {obj.locked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Rearrange order */}
                        <div className="flex flex-col">
                          <button
                            onClick={(e) => moveLayerIndex(obj.id, 'up', e)}
                            disabled={actualIdx === objects.length - 1}
                            className={`p-0.5 rounded ${actualIdx === objects.length - 1 ? 'text-outline-variant cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-surface-container'}`}
                            title="Bring Forward"
                          >
                            <MoveUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={(e) => moveLayerIndex(obj.id, 'down', e)}
                            disabled={actualIdx === 0}
                            className={`p-0.5 rounded ${actualIdx === 0 ? 'text-outline-variant cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-surface-container'}`}
                            title="Send Backward"
                          >
                            <MoveDown className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Trash */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteObject(obj.id); }}
                          className="p-1 hover:bg-error-container/20 rounded text-secondary hover:text-error"
                          title="Delete layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* WORKSPACE CENTRAL CANVA */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-grow h-full relative overflow-hidden bg-background transition-all duration-200 ${
            isDragOver ? 'ring-4 ring-primary/40 ring-inset bg-primary/5' : ''
          }`}
        >
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
              onDoubleClick={handleDoubleClick}
              className={`w-full h-full min-h-[600px] border border-outline-variant/40 rounded-xl relative shadow-inner overflow-hidden transition-all ${
                canvasSettings.transparentBackground ? 'checkerboard-bg' : 'bg-surface-bright'
              }`}
              style={{ cursor: getCursorClass() }}
            >
              <defs>
                <pattern
                  id="gridPattern"
                  width={canvasSettings.gridSize}
                  height={canvasSettings.gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="1.5"
                    cy="1.5"
                    r="1"
                    fill="var(--color-outline-variant)"
                    opacity="0.8"
                  />
                </pattern>
              </defs>

              <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
                {/* Grid Background Pattern inside the scaled viewport group */}
                {canvasSettings.showGrid && (
                  <rect
                    x={-50000}
                    y={-50000}
                    width={100000}
                    height={100000}
                    fill="url(#gridPattern)"
                    className="pointer-events-none"
                  />
                )}

                {/* DRAWN VECTOR ELEMENTS */}
                {objects.map((obj) => {
                  if (obj.visible === false) return null;
                  const isSelected = obj.id === selectedId;
                  
                  return (
                    <g 
                      key={obj.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveTool('select');
                        setSelectedId(obj.id);
                        if (!obj.locked) {
                          setIsDragging(true);
                          const coords = getMouseCoords(e);
                          setDragOffset({
                            x: coords.x - obj.x,
                            y: coords.y - obj.y
                          });
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTool('select');
                        setSelectedId(obj.id);
                      }}
                      className="cursor-pointer"
                    >
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
                        editingTextId === obj.id ? (
                          <foreignObject
                            x={obj.x - 4}
                            y={obj.y - 14}
                            width={160}
                            height={30}
                          >
                            <input
                              type="text"
                              value={obj.text || ''}
                              onChange={(e) => updateSelectedProperty('text', e.target.value)}
                              onBlur={() => {
                                setEditingTextId(null);
                                pushHistory(objects);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingTextId(null);
                                  pushHistory(objects);
                                }
                              }}
                              autoFocus
                              className="w-full h-full bg-surface border-2 border-primary outline-none text-xs font-semibold px-2 rounded-lg shadow-md text-on-surface"
                            />
                          </foreignObject>
                        ) : (
                          <text
                            x={obj.x}
                            y={obj.y}
                            fill={obj.stroke === 'transparent' ? '#000000' : obj.stroke}
                            fontFamily="Geist, sans-serif"
                            fontSize="16"
                            fontWeight="500"
                            dominantBaseline="middle"
                            pointerEvents="auto"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingTextId(obj.id);
                            }}
                          >
                            {obj.text || ''}
                          </text>
                        )
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
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              vectorEffect="non-scaling-stroke"
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
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              vectorEffect="non-scaling-stroke"
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
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                              vectorEffect="non-scaling-stroke"
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
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Quick instructions floating helper at bottom-left */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden md:flex items-center gap-4 bg-surface-bright/80 border border-outline-variant/30 px-3.5 py-2 rounded-full backdrop-blur-sm shadow-md text-[10px] font-medium text-secondary">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 font-mono bg-surface border border-outline-variant rounded shadow-sm text-on-surface font-bold">Space + Drag</kbd> Pan
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60"></span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 font-mono bg-surface border border-outline-variant rounded shadow-sm text-on-surface font-bold">Scroll Wheel</kbd> Zoom
            </span>
          </div>

          {/* Floating Zoom & Viewport Controls in bottom right */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1 bg-surface-bright/95 border border-outline-variant/60 p-1 rounded-xl shadow-lg backdrop-blur-md">
            <button
              onClick={() => {
                const cx = svgRef.current ? svgRef.current.clientWidth / 2 : 400;
                const cy = svgRef.current ? svgRef.current.clientHeight / 2 : 300;
                setViewport(prev => zoomAtScreenPoint(cx, cy, prev, 0.8, 0.15, 8.0));
              }}
              className="p-1.5 hover:bg-surface-container rounded-lg text-secondary hover:text-on-surface transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-secondary px-2 min-w-[42px] text-center select-none">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <button
              onClick={() => {
                const cx = svgRef.current ? svgRef.current.clientWidth / 2 : 400;
                const cy = svgRef.current ? svgRef.current.clientHeight / 2 : 300;
                setViewport(prev => zoomAtScreenPoint(cx, cy, prev, 1.2, 0.15, 8.0));
              }}
              className="p-1.5 hover:bg-surface-container rounded-lg text-secondary hover:text-on-surface transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-outline-variant/40 mx-1"></div>
            <button
              onClick={() => {
                setViewport({ x: 0, y: 0, zoom: 1 });
              }}
              className="p-1.5 hover:bg-surface-container rounded-lg text-secondary hover:text-on-surface transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-1"
              title="Reset Zoom to 100%"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT PROPERTY INSPECTOR SIDEBAR */}
        <aside 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-[280px] h-full bg-surface-bright border-l border-outline-variant/40 shrink-0 z-20 flex flex-col overflow-y-auto custom-scrollbar"
        >
          
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
                  <div className="space-y-3">
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
                    <div className="space-y-1">
                      <label className="text-[10px] text-secondary font-semibold block">Or Upload Local Image</label>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        Choose Image File
                      </button>
                    </div>
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
