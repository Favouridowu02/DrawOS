import { ArrowRight, Code, Zap, HardDrive, Github, Play, CheckCircle2, Sliders, Layers, Target, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import DocsBrowser from './DocsBrowser';
import { Drawing } from '@/src/types';

interface LandingPageProps {
  onLaunchEditor: () => void;
  onLaunchWithTemplate?: (drawing: Drawing) => void;
}

// Crisp geometric vector representation of the official DrawOS brand logo
export function DrawOSLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer rounded container (squircle) */}
      <rect x="14" y="14" width="72" height="72" rx="22" />
      {/* Diagonal vector path from bottom-left to top-right */}
      <line x1="26" y1="74" x2="74" y2="26" />
      {/* Central mathematical vector control node (solid dot on diagonal) */}
      <circle cx="50" cy="50" r="8.5" fill="currentColor" stroke="none" />
      {/* Stylized "D" shape - curved vector loop starting from left side */}
      <path d="M 14 32 L 32 32 C 45 32, 50 40, 50 50 C 50 60, 45 68, 32 68 L 14 68" />
    </svg>
  );
}

// Definitions for the two professional templates
const FLOWCHART_TEMPLATE: Drawing = {
  id: 'template-user-flow',
  name: 'User Authentication Flowchart',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  objects: [
    {
      id: 'flow-rect-start',
      type: 'rectangle',
      x: 100,
      y: 180,
      width: 140,
      height: 60,
      fill: '#e9edff',
      stroke: '#004ac6',
      strokeWidth: 2
    },
    {
      id: 'flow-text-start',
      type: 'text',
      x: 120,
      y: 215,
      text: 'Start: User Visit',
      fill: 'transparent',
      stroke: '#151b2a',
      strokeWidth: 1
    },
    {
      id: 'flow-path-arrow1',
      type: 'path',
      x: 240,
      y: 210,
      points: 'M 240 210 L 320 210',
      fill: 'transparent',
      stroke: '#004ac6',
      strokeWidth: 2
    },
    {
      id: 'flow-rect-decision',
      type: 'rectangle',
      x: 320,
      y: 160,
      width: 160,
      height: 100,
      fill: '#ffffff',
      stroke: '#2563eb',
      strokeWidth: 2
    },
    {
      id: 'flow-text-decision',
      type: 'text',
      x: 340,
      y: 215,
      text: 'Has Valid Session?',
      fill: 'transparent',
      stroke: '#151b2a',
      strokeWidth: 1
    },
    {
      id: 'flow-path-arrow-yes',
      type: 'path',
      x: 480,
      y: 210,
      points: 'M 480 210 L 560 210',
      fill: 'transparent',
      stroke: '#004ac6',
      strokeWidth: 2
    },
    {
      id: 'flow-rect-dashboard',
      type: 'rectangle',
      x: 560,
      y: 180,
      width: 150,
      height: 60,
      fill: '#edf0ff',
      stroke: '#2563eb',
      strokeWidth: 2
    },
    {
      id: 'flow-text-dashboard',
      type: 'text',
      x: 580,
      y: 215,
      text: 'Redirect Dashboard',
      fill: 'transparent',
      stroke: '#151b2a',
      strokeWidth: 1
    }
  ]
};

const WIREFRAME_TEMPLATE: Drawing = {
  id: 'template-wireframe',
  name: 'Minimal SaaS App Wireframe',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  objects: [
    {
      id: 'wf-shell',
      type: 'rectangle',
      x: 150,
      y: 100,
      width: 500,
      height: 350,
      fill: '#f1f3ff',
      stroke: '#737686',
      strokeWidth: 2
    },
    {
      id: 'wf-header',
      type: 'rectangle',
      x: 150,
      y: 100,
      width: 500,
      height: 50,
      fill: '#ffffff',
      stroke: '#c3c6d7',
      strokeWidth: 1
    },
    {
      id: 'wf-brand-text',
      type: 'text',
      x: 170,
      y: 130,
      text: 'DrawOS App Shell',
      fill: 'transparent',
      stroke: '#151b2a',
      strokeWidth: 1
    },
    {
      id: 'wf-content-box1',
      type: 'rectangle',
      x: 175,
      y: 180,
      width: 210,
      height: 240,
      fill: '#ffffff',
      stroke: '#c3c6d7',
      strokeWidth: 1
    },
    {
      id: 'wf-content-box2',
      type: 'rectangle',
      x: 415,
      y: 180,
      width: 210,
      height: 240,
      fill: '#e9edff',
      stroke: '#004ac6',
      strokeWidth: 1.5
    },
    {
      id: 'wf-inner-heading',
      type: 'text',
      x: 435,
      y: 220,
      text: 'Interactive Canvas Workspace',
      fill: 'transparent',
      stroke: '#004ac6',
      strokeWidth: 1
    }
  ]
};

export default function LandingPage({ onLaunchEditor, onLaunchWithTemplate }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'templates' | 'docs'>('features');

  // Interactive Sandbox state for Features page
  const [sandboxShape, setSandboxShape] = useState<'rect' | 'circle' | 'polygon'>('rect');
  const [sandboxX, setSandboxX] = useState<number>(140);
  const [sandboxY, setSandboxY] = useState<number>(100);
  const [sandboxSize, setSandboxSize] = useState<number>(90);
  const [sandboxColor, setSandboxColor] = useState<string>('#004ac6');

  const handleLaunchTemplate = (drawing: Drawing) => {
    if (onLaunchWithTemplate) {
      onLaunchWithTemplate(drawing);
    } else {
      onLaunchEditor();
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-[#151b2a] font-sans min-h-screen flex flex-col antialiased selection:bg-[#e9edff] selection:text-[#004ac6]">
      {/* Fixed Layout Top Header */}
      <header className="fixed top-0 left-0 right-0 h-[64px] bg-[#f9f9ff]/90 backdrop-blur-md border-b border-[#c3c6d7] flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-3">
          <div className="text-[#004ac6] flex items-center justify-center transition-transform hover:rotate-12 duration-300">
            <DrawOSLogo className="w-7 h-7" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#151b2a]">DrawOS</span>
        </div>

        {/* Center Tabs Navigation - Removed Pricing */}
        <nav className="hidden md:flex items-center gap-8 h-full relative">
          {(['features', 'templates', 'docs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold capitalize tracking-tight relative py-5 cursor-pointer transition-colors ${
                activeTab === tab ? 'text-[#151b2a]' : 'text-[#434655] hover:text-[#151b2a]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#004ac6]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Button - Removed Sign-In */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchEditor}
            className="bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            Go to App
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-[64px] flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* FEATURES / MAIN TAB VIEW */}
          {activeTab === 'features' && (
            <motion.div
              key="features-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-6 py-12 md:py-16 flex flex-col items-center"
            >
              {/* Centered Drawing Logo Box */}
              <div className="w-24 h-24 bg-white border border-[#c3c6d7] rounded-2xl shadow-sm flex items-center justify-center mb-8 hover:border-[#004ac6] transition-colors duration-300">
                <DrawOSLogo className="w-12 h-12 text-[#151b2a]" />
              </div>

              {/* Title & Headline */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#151b2a] text-center mb-6 max-w-3xl leading-[1.1]">
                The Free open-source drawing engine for the web.
              </h1>

              <p className="text-base md:text-lg text-[#434655] max-w-2xl text-center mb-10 leading-relaxed">
                Professional canvas editor focused on drawing, geometry, and performance. Local-first, no accounts, just draw.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
                <button
                  onClick={onLaunchEditor}
                  className="px-6 py-3 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md hover:translate-y-[-1px]"
                >
                  Launch App
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-[#c3c6d7] text-[#151b2a] bg-white hover:bg-[#f1f3ff] rounded-lg transition-all text-sm font-semibold flex items-center gap-2 cursor-pointer hover:border-[#004ac6]"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>

              {/* 3 Grid Core Features (Style Guidelines Compliant) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left mb-20">
                <div className="bg-white border border-[#c3c6d7] rounded-2xl p-8 flex flex-col items-start transition-all hover:border-[#004ac6]/30 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f3ff] flex items-center justify-center mb-6 text-[#004ac6]">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#151b2a] mb-3">Local First</h3>
                  <p className="text-sm text-[#434655] leading-relaxed">
                    Your data stays on your machine. No accounts, no cloud sync required. Save directly to your file system.
                  </p>
                </div>

                <div className="bg-white border border-[#c3c6d7] rounded-2xl p-8 flex flex-col items-start transition-all hover:border-[#004ac6]/30 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f3ff] flex items-center justify-center mb-6 text-[#004ac6]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#151b2a] mb-3">High Performance</h3>
                  <p className="text-sm text-[#434655] leading-relaxed">
                    Engineered for speed. Handles complex vector graphics and massive canvases with buttery smooth 60fps rendering.
                  </p>
                </div>

                <div className="bg-white border border-[#c3c6d7] rounded-2xl p-8 flex flex-col items-start transition-all hover:border-[#004ac6]/30 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f3ff] flex items-center justify-center mb-6 text-[#004ac6]">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#151b2a] mb-3">Open Source</h3>
                  <p className="text-sm text-[#434655] leading-relaxed">
                    Built by the community, for the community. Inspect the code, contribute features, and make it your own.
                  </p>
                </div>
              </div>

              {/* STUNNING INTERACTIVE FEATURE PLAYGROUND (Brand Alignment: Precision Technical Canvas) */}
              <div className="w-full bg-white border border-[#c3c6d7] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch text-left shadow-sm">
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-[#004ac6] tracking-wider uppercase bg-[#e9edff] px-2.5 py-1 rounded-full">Interactive Sandbox</span>
                    <h2 className="text-2xl font-bold tracking-tight text-[#151b2a] mt-3">Precision Geometry Engine</h2>
                    <p className="text-sm text-[#434655] leading-relaxed mt-2">
                      Test our high-performance coordinate calculations and vector snapping logic right here. Drag sliders to adjust coordinates, sizes, and colors, and see how the DrawOS canvas updates instantly in real-time.
                    </p>
                  </div>

                  {/* Interactor Controls */}
                  <div className="space-y-4 pt-2 border-t border-[#c3c6d7]/40">
                    {/* Shape Selector */}
                    <div>
                      <label className="text-xs font-bold text-[#434655] block mb-2">Active Element Type</label>
                      <div className="flex gap-2">
                        {(['rect', 'circle', 'polygon'] as const).map((shape) => (
                          <button
                            key={shape}
                            onClick={() => setSandboxShape(shape)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize border cursor-pointer transition-all ${
                              sandboxShape === shape
                                ? 'bg-[#004ac6] text-white border-[#004ac6]'
                                : 'bg-white text-[#434655] border-[#c3c6d7] hover:bg-[#f1f3ff]'
                            }`}
                          >
                            {shape === 'rect' ? 'Rectangle' : shape === 'circle' ? 'Circle' : 'Polygon Anchor'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* X Coordinate Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-[#434655] mb-1 font-mono">
                        <span>Coordinate X</span>
                        <span className="text-[#004ac6] font-bold">{sandboxX}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="260"
                        value={sandboxX}
                        onChange={(e) => setSandboxX(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#f1f3ff] rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
                      />
                    </div>

                    {/* Y Coordinate Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-[#434655] mb-1 font-mono">
                        <span>Coordinate Y</span>
                        <span className="text-[#004ac6] font-bold">{sandboxY}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="180"
                        value={sandboxY}
                        onChange={(e) => setSandboxY(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#f1f3ff] rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
                      />
                    </div>

                    {/* Scale Size Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-[#434655] mb-1 font-mono">
                        <span>Bounding Radius / Scale</span>
                        <span className="text-[#004ac6] font-bold">{sandboxSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="140"
                        value={sandboxSize}
                        onChange={(e) => setSandboxSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#f1f3ff] rounded-lg appearance-none cursor-pointer accent-[#004ac6]"
                      />
                    </div>

                    {/* Color Swatches */}
                    <div>
                      <label className="text-xs font-bold text-[#434655] block mb-2">Vector Hex Color</label>
                      <div className="flex gap-2">
                        {['#004ac6', '#2563eb', '#ba1a1a', '#565e74', '#151b2a'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setSandboxColor(color)}
                            className="w-6 h-6 rounded-full cursor-pointer transition-all border border-black/10 flex items-center justify-center relative hover:scale-110"
                            style={{ backgroundColor: color }}
                          >
                            {sandboxColor === color && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Canvas Sandbox Visualizer */}
                <div className="flex-1 bg-[#f1f3ff] border border-[#c3c6d7] rounded-xl flex flex-col overflow-hidden min-h-[300px]">
                  {/* Canvas Header */}
                  <div className="h-10 bg-white border-b border-[#c3c6d7] px-4 flex justify-between items-center text-[11px] text-[#434655] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>PREVIEW_GRID_SANDBOX_ACTIVE</span>
                    </div>
                    <span>Zoom: 100%</span>
                  </div>

                  {/* SVG Display */}
                  <div className="flex-grow bg-white p-4 relative flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#c3c6d7 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    <svg className="w-full h-full min-h-[200px]" viewBox="0 0 400 240">
                      {/* Bounding box guide line */}
                      <rect
                        x={sandboxX - 5}
                        y={sandboxY - 5}
                        width={sandboxSize + 10}
                        height={sandboxSize + 10}
                        fill="none"
                        stroke="#004ac6"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        className="opacity-50"
                      />

                      {/* Geometric Grid Snap Anchor Crosses */}
                      <line x1="0" y1={sandboxY} x2="400" y2={sandboxY} stroke="#c3c6d7" strokeWidth="0.5" strokeDasharray="5,5" />
                      <line x1={sandboxX} y1="0" x2={sandboxX} y2="240" stroke="#c3c6d7" strokeWidth="0.5" strokeDasharray="5,5" />

                      {/* Render Chosen Shape */}
                      {sandboxShape === 'rect' && (
                        <rect
                          x={sandboxX}
                          y={sandboxY}
                          width={sandboxSize}
                          height={sandboxSize * 0.7}
                          fill={sandboxColor}
                          fillOpacity={0.15}
                          stroke={sandboxColor}
                          strokeWidth="2.5"
                          rx="6"
                        />
                      )}
                      {sandboxShape === 'circle' && (
                        <circle
                          cx={sandboxX + sandboxSize / 2}
                          cy={sandboxY + sandboxSize / 2}
                          r={sandboxSize / 2}
                          fill={sandboxColor}
                          fillOpacity={0.15}
                          stroke={sandboxColor}
                          strokeWidth="2.5"
                        />
                      )}
                      {sandboxShape === 'polygon' && (
                        <polygon
                          points={`${sandboxX + sandboxSize/2},${sandboxY} ${sandboxX + sandboxSize},${sandboxY + sandboxSize} ${sandboxX},${sandboxY + sandboxSize}`}
                          fill={sandboxColor}
                          fillOpacity={0.15}
                          stroke={sandboxColor}
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Interactive Vertex Anchors */}
                      <circle cx={sandboxX} cy={sandboxY} r="4.5" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
                      <circle cx={sandboxX + sandboxSize} cy={sandboxY} r="4.5" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
                      {sandboxShape === 'rect' ? (
                        <>
                          <circle cx={sandboxX} cy={sandboxY + sandboxSize*0.7} r="4.5" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
                          <circle cx={sandboxX + sandboxSize} cy={sandboxY + sandboxSize*0.7} r="4.5" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
                        </>
                      ) : (
                        <circle cx={sandboxX + sandboxSize} cy={sandboxY + sandboxSize} r="4.5" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
                      )}
                    </svg>

                    {/* Floater inspect overlay */}
                    <div className="absolute bottom-3 right-3 bg-[#151b2a] text-white/90 text-[10px] font-mono p-2.5 rounded-lg border border-white/10 shadow-lg space-y-1">
                      <div>ID: shape_layer_vector</div>
                      <div>Type: {sandboxShape.toUpperCase()}</div>
                      <div>POS: {sandboxX}X, {sandboxY}Y</div>
                      <div>SIZE: {sandboxSize}W</div>
                      <div className="text-[#004ac6] font-bold">SNAP: GRID_ACTIVE</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TEMPLATES TAB VIEW - Two Beautiful templates */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-6 py-12 flex flex-col items-center"
            >
              <div className="text-center max-w-3xl mb-12">
                <span className="text-[10px] font-bold text-[#004ac6] tracking-wider uppercase bg-[#e9edff] px-2.5 py-1 rounded-full">Templates Registry</span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#151b2a] mt-4 mb-4">Start with a pre-built canvas</h1>
                <p className="text-sm md:text-base text-[#434655] leading-relaxed">
                  Skip the blank page. Kickstart your work with a highly optimized template layout built for modern system diagrams and user design structures.
                </p>
              </div>

              {/* Templates Grid Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                
                {/* Template 1: User Flowchart */}
                <div className="bg-white border border-[#c3c6d7] rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all hover:border-[#004ac6]/40 hover:shadow-md group">
                  {/* Top Schematic Blueprint Preview */}
                  <div className="h-[200px] bg-[#f1f3ff]/50 border-b border-[#c3c6d7]/60 p-4 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#004ac6 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    <svg className="w-full h-full max-w-[360px]" viewBox="0 0 400 160">
                      {/* Flow Node 1 */}
                      <rect x="20" y="55" width="90" height="40" rx="6" fill="#e9edff" stroke="#004ac6" strokeWidth="1.5" />
                      <text x="32" y="79" fill="#151b2a" fontSize="9" fontWeight="bold" fontFamily="monospace">User Enters</text>
                      
                      {/* Flow Arrow 1 */}
                      <path d="M 110 75 L 150 75" fill="none" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="3,3" />
                      <polygon points="150,75 145,71 145,79" fill="#004ac6" />

                      {/* Flow Decision Node */}
                      <polygon points="195,35 245,75 195,115 145,75" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
                      <text x="171" y="78" fill="#151b2a" fontSize="8" fontWeight="bold" fontFamily="monospace">Logged In?</text>

                      {/* Flow Arrow 2 */}
                      <path d="M 245 75 L 285 75" fill="none" stroke="#004ac6" strokeWidth="1.5" />
                      <polygon points="285,75 280,71 280,79" fill="#004ac6" />

                      {/* Flow Node 2 */}
                      <rect x="285" y="55" width="95" height="40" rx="6" fill="#edf0ff" stroke="#2563eb" strokeWidth="1.5" />
                      <text x="295" y="79" fill="#151b2a" fontSize="8" fontWeight="bold" fontFamily="monospace">Dashboard</text>
                    </svg>

                    <div className="absolute top-3 left-3 bg-[#004ac6] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      Flowchart
                    </div>
                  </div>

                  {/* Template Info Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between items-start">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-lg font-bold text-[#151b2a] tracking-tight">{FLOWCHART_TEMPLATE.name}</h3>
                      <p className="text-xs text-[#434655] leading-relaxed">
                        A clean, ready-to-draw state machine flowchart representing an auth check, redirects, and state transitions. Excellent for user journey mapping.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <span className="text-[10px] font-mono text-[#004ac6] bg-[#e9edff] px-2 py-0.5 rounded">8 objects</span>
                        <span className="text-[10px] font-mono text-[#434655] bg-[#f1f3ff] px-2 py-0.5 rounded">Snapping: Active</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchTemplate(FLOWCHART_TEMPLATE)}
                      className="w-full py-2.5 bg-white border border-[#c3c6d7] text-[#151b2a] hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6] transition-all text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Launch This Template
                    </button>
                  </div>
                </div>

                {/* Template 2: SaaS Wireframe */}
                <div className="bg-white border border-[#c3c6d7] rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all hover:border-[#004ac6]/40 hover:shadow-md group">
                  {/* Top Schematic Blueprint Preview */}
                  <div className="h-[200px] bg-[#f1f3ff]/50 border-b border-[#c3c6d7]/60 p-4 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#004ac6 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    <svg className="w-full h-full max-w-[360px]" viewBox="0 0 400 160">
                      {/* App Frame */}
                      <rect x="30" y="15" width="340" height="130" rx="4" fill="#f1f3ff" stroke="#737686" strokeWidth="1.5" />
                      
                      {/* App Header */}
                      <rect x="30" y="15" width="340" height="24" fill="#ffffff" stroke="#c3c6d7" strokeWidth="1" />
                      <line x1="45" y1="27" x2="75" y2="27" stroke="#004ac6" strokeWidth="3" />
                      <line x1="330" y1="27" x2="355" y2="27" stroke="#737686" strokeWidth="2" />

                      {/* Content column 1 */}
                      <rect x="42" y="50" width="145" height="84" rx="3" fill="#ffffff" stroke="#c3c6d7" strokeWidth="1" />
                      <line x1="54" y1="70" x2="110" y2="70" stroke="#737686" strokeWidth="3" />
                      <line x1="54" y1="84" x2="140" y2="84" stroke="#c3c6d7" strokeWidth="1.5" />
                      <line x1="54" y1="94" x2="125" y2="94" stroke="#c3c6d7" strokeWidth="1.5" />

                      {/* Content column 2 */}
                      <rect x="202" y="50" width="155" height="84" rx="3" fill="#e9edff" stroke="#004ac6" strokeWidth="1.5" />
                      <rect x="220" y="70" width="120" height="44" rx="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1" />
                      <line x1="240" y1="92" x2="320" y2="92" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    <div className="absolute top-3 left-3 bg-[#004ac6] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      Wireframe
                    </div>
                  </div>

                  {/* Template Info Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between items-start">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-lg font-bold text-[#151b2a] tracking-tight">{WIREFRAME_TEMPLATE.name}</h3>
                      <p className="text-xs text-[#434655] leading-relaxed">
                        A preloaded layout structure with an application container frame, navbar header layout, content side rails, and an interactive main canvas zone.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <span className="text-[10px] font-mono text-[#004ac6] bg-[#e9edff] px-2 py-0.5 rounded">6 objects</span>
                        <span className="text-[10px] font-mono text-[#434655] bg-[#f1f3ff] px-2 py-0.5 rounded">Ratio: 16:10</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchTemplate(WIREFRAME_TEMPLATE)}
                      className="w-full py-2.5 bg-white border border-[#c3c6d7] text-[#151b2a] hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6] transition-all text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Launch This Template
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* DOCS TAB VIEW - Connected Docs Browser */}
          {activeTab === 'docs' && (
            <motion.div
              key="docs-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl px-6 py-12 flex flex-col items-center"
            >
              <div className="text-center max-w-3xl mb-12">
                <span className="text-[10px] font-bold text-[#004ac6] tracking-wider uppercase bg-[#e9edff] px-2.5 py-1 rounded-full">Documentation</span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#151b2a] mt-4 mb-4">Learn to Master DrawOS</h1>
                <p className="text-sm md:text-base text-[#434655] leading-relaxed">
                  Browse shortcuts, technical design specs, custom vector properties, and setup integrations for our digital design engine workspace.
                </p>
              </div>

              {/* Renders the highly interactive imported DocsBrowser */}
              <div className="w-full">
                <DocsBrowser />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f9f9ff] border-t border-[#c3c6d7]/50 py-8 px-8 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#434655]">
          <div className="flex items-center gap-2">
            <DrawOSLogo className="w-4 h-4 text-[#004ac6]" />
            <span>© 2026 DrawOS Engine</span>
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#privacy" className="hover:text-[#151b2a] transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-[#151b2a] transition-colors">Terms</a>
            <a href="#api" className="hover:text-[#151b2a] transition-colors">API</a>
            <a href="#status" className="hover:text-[#151b2a] transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
