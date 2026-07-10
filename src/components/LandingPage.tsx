import { ArrowRight, Sparkles, Code, Save, Bolt, CheckCircle2, ChevronRight, Github } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLaunchEditor: () => void;
}

export default function LandingPage({ onLaunchEditor }: LandingPageProps) {
  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full h-[56px] border-b border-outline-variant/30 bg-surface-bright/80 backdrop-blur-md flex justify-between items-center px-6 z-50 transition-all duration-300">
        <div className="flex items-center gap-3">
          <img
            alt="DrawOS Logo"
            className="w-8 h-8 rounded"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QXkxy3sALdb0x34RktvYkaT9WCSYexYdwzjaq3puW41PwiPRxGfNpmVhwQgw2yGRMvgaPM93bzsB0rGdXewfzjdfO-SLdD6QEMjKUgYqGPcOT8hYrbxpSqFU5dCqwTxD0IV9W_5yp7pX6LJ40VWYlbPDwBCJZJ7OqFaVqa7hjFX2MQJHpOyx_EY_MrC_Eb-UxAcFQhCwN2hUvjqdQc8qzGXQ9AQ7K1oih6hv1IKklWiXv3uT-1AHGoLjmyReV517OFaGB2ZD9OIa"
          />
          <span className="text-sm font-bold text-on-surface tracking-tight">DrawOS</span>
        </div>
        <nav className="hidden md:flex items-center h-full gap-8">
          <a className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#features">Features</a>
          <a className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#api">API</a>
          <a className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#schema">JSON Schema</a>
          <a className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#docs">Docs</a>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onLaunchEditor} className="hidden md:flex text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">Sign In</button>
          <button
            onClick={onLaunchEditor}
            className="px-4 py-2 bg-on-surface text-surface-container-lowest rounded-full hover:opacity-90 transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            Go to App <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[56px] flex flex-col">
        {/* Hero Section (Dark Theme) */}
        <section className="relative w-full bg-[#0a0a0a] text-white pt-24 pb-20 px-6 overflow-hidden flex flex-col items-center">
          {/* Radial cosmic gradient background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `
                radial-gradient(circle at 50% -20%, rgba(37,99,235,0.18) 0%, rgba(0,0,0,0) 50%),
                radial-gradient(circle at 85% 60%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 40%)
              `
            }}
          />

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-mono mb-8 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              v2.0 is now available
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-7xl leading-[1.05] font-bold text-white mb-8 tracking-tighter max-w-4xl"
            >
              The Professional Drawing Engine for the Modern Web.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl font-light text-white/60 max-w-2xl mb-12 leading-relaxed"
            >
              Local-first architecture meets unparalleled geometry precision. Built for developers, designed for creators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto"
            >
              <button
                onClick={onLaunchEditor}
                className="w-full sm:w-auto px-8 py-4 bg-primary-container text-white rounded-full hover:bg-primary-container/90 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.25)] cursor-pointer"
              >
                Launch Editor
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </motion.div>

            {/* High-fidelity Product Preview Component */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="w-full max-w-5xl rounded-2xl bg-[#111111] border border-white/10 p-2 shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-20 pointer-events-none rounded-2xl h-1/2 bottom-0"></div>
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col h-[400px] md:h-[500px] border border-white/5">
                {/* Toolbar */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#111111]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/25"></div>
                    <div className="w-3 h-3 rounded-full bg-white/25"></div>
                    <div className="w-3 h-3 rounded-full bg-white/25"></div>
                  </div>
                  <div className="flex items-center gap-4 text-white/50 text-xs">
                    <span>Undo</span>
                    <span>Redo</span>
                    <div className="w-px h-4 bg-white/10"></div>
                    <span className="text-white bg-primary-container/20 px-2.5 py-0.5 rounded">Editor Workspace</span>
                  </div>
                  <div className="text-xs font-mono text-white/30">100%</div>
                </div>

                {/* Canvas Area */}
                <div
                  className="flex-1 relative bg-[#0f0f0f] overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  {/* Geometric overlays mimicking DrawOS landing visual */}
                  <div className="absolute w-[260px] h-[260px] border border-white/15 rounded-full animate-[spin_40s_linear_infinite]"></div>
                  <div className="absolute w-[180px] h-[180px] border-2 border-primary-container rounded-lg rotate-45 shadow-[0_0_40px_rgba(37,99,235,0.15)] flex items-center justify-center">
                    <div className="w-[100px] h-[100px] bg-white/5 backdrop-blur-md border border-white/15 rounded rotate-[-45deg] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-container" />
                    </div>
                  </div>

                  {/* Handles */}
                  <div className="absolute top-[calc(50%-90px)] left-[calc(50%-90px)] w-2.5 h-2.5 bg-primary-container border border-white"></div>
                  <div className="absolute top-[calc(50%+90px)] left-[calc(50%+90px)] w-2.5 h-2.5 bg-primary-container border border-white"></div>

                  {/* Floating Custom Tooltip overlay */}
                  <div className="absolute bottom-6 bg-[#222] border border-white/15 rounded-lg py-2 px-3 text-xs text-white/80 font-mono shadow-xl flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary-container"></div>
                    <span>STROKE_WEIGHT</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white">#004ac6</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Box Feature Showcase */}
        <section id="features" className="w-full max-w-6xl mx-auto py-24 px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-4">Engineered for excellence.</h2>
            <p className="text-base text-on-surface-variant max-w-2xl">A robust foundation providing the primitives you need to build next-generation creative tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[300px]">
            {/* Blazing Fast Performance - 2 Columns wide */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-outline-variant transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30 shadow-sm">
                  <Bolt className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-3 tracking-tight">Blazing Fast Performance</h3>
                <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
                  Engineered for speed from the ground up. Utilizing optimized state and event handling to process complex vector shapes and massive canvases with buttery smooth rendering, keeping your productivity high.
                </p>
              </div>
              {/* Decorative design */}
              <div className="relative h-12 flex items-end gap-1 opacity-60">
                <div className="w-full h-[40%] bg-outline-variant/20 rounded-t-sm"></div>
                <div className="w-full h-[60%] bg-outline-variant/30 rounded-t-sm"></div>
                <div className="w-full h-[85%] bg-primary-container/20 rounded-t-sm border-t border-primary-container/40"></div>
                <div className="w-full h-[30%] bg-outline-variant/25 rounded-t-sm"></div>
                <div className="w-full h-[70%] bg-primary-container/10 rounded-t-sm"></div>
                <div className="w-full h-[55%] bg-outline-variant/30 rounded-t-sm"></div>
              </div>
            </div>

            {/* Local-First Architecture */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-outline-variant transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30 shadow-sm">
                  <Save className="w-5 h-5 text-on-surface" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3 tracking-tight">Local-First Architecture</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your data stays in your browser. No mandatory accounts, no cloud dependencies. Save drawings locally or export instantly to lightweight JSON.
                </p>
              </div>
              {/* File layout decoration */}
              <div className="flex gap-3 pt-4 overflow-hidden opacity-80 translate-y-3">
                <div className="w-14 h-16 shrink-0 border border-outline-variant rounded-lg bg-surface shadow-sm relative p-2 flex flex-col justify-between">
                  <div className="w-6 h-1 bg-outline rounded"></div>
                  <div className="w-8 h-1 bg-outline-variant rounded"></div>
                  <span className="text-[8px] font-mono text-outline font-bold">JSON</span>
                </div>
                <div className="w-14 h-16 shrink-0 border border-primary/30 rounded-lg bg-primary-container/5 shadow-sm relative p-2 flex flex-col justify-between -translate-y-2">
                  <div className="w-6 h-1 bg-primary rounded"></div>
                  <div className="w-8 h-1 bg-primary-container/30 rounded"></div>
                  <span className="text-[8px] font-mono text-primary font-bold">DRAW</span>
                </div>
                <div className="w-14 h-16 shrink-0 border border-outline-variant rounded-lg bg-surface shadow-sm relative p-2 flex flex-col justify-between">
                  <div className="w-4 h-1 bg-outline rounded"></div>
                  <div className="w-6 h-1 bg-outline-variant rounded"></div>
                  <span className="text-[8px] font-mono text-outline font-bold">SVG</span>
                </div>
              </div>
            </div>

            {/* Geometric Precision */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-outline-variant transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30 shadow-sm">
                  <span className="font-mono text-base font-bold text-on-surface">SVG</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3 tracking-tight">Geometric Precision</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Highly optimized SVG layouts, snap-to-grid, customizable stroke-weights, and crisp mathematical rendering of curves, shapes, and texts.
                </p>
              </div>
              <div className="flex justify-center items-center h-16 relative opacity-50">
                <div className="w-12 h-12 border border-outline-variant rounded-full absolute -ml-6"></div>
                <div className="w-12 h-12 border border-outline-variant rounded-full absolute ml-6"></div>
                <div className="w-6 h-6 bg-primary-container/20 border border-primary-container/40 absolute"></div>
              </div>
            </div>

            {/* Extensible Core API - 2 columns wide */}
            <div id="api" className="md:col-span-2 bg-[#020617] text-white border border-outline-variant/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group">
              <div className="flex-1 z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 backdrop-blur-sm">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Extensible Core API</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Every shape, property, and canvas layout is a pure serializable element. Leverage direct properties to programmatically customize drawing workflows, download custom models, and manipulate coordinates.
                </p>
              </div>
              <div className="flex-1 w-full h-full min-h-[160px] bg-[#0f172a] rounded-xl border border-white/10 p-5 font-mono text-[10px] text-white/80 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0f172a]/90 pointer-events-none z-10"></div>
                <pre className="custom-scrollbar overflow-auto">
                  <code>{`const canvas = new DrawOS({
  target: 'workspace',
  grid: { size: 24, snap: true },
  elements: [
    { type: 'rect', w: 120, h: 80 },
    { type: 'circle', r: 30 }
  ]
});

canvas.on('object:select', (obj) => {
  console.log('Selected: ' + obj.id);
});`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Designed as data section */}
        <section id="schema" className="w-full max-w-6xl mx-auto py-24 px-6 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-6">Designed as data.</h2>
              <p className="text-base text-on-surface-variant mb-8 leading-relaxed">
                Everything in DrawOS is fully serializable JSON. Manipulate your designs programmatically, inspect and edit layout states in real-time, or back them up effortlessly. The strict separation of state from rendering ensures flawless execution.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-on-surface-variant">Deterministic mathematical state alignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-on-surface-variant">Easily compare and diff lightweight JSON drawing configurations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-on-surface-variant">Headless friendly representation perfect for automated exports</span>
                </li>
              </ul>
            </div>

            {/* Dual Preview (Code + Visual) */}
            <div className="relative h-[380px] w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-xl overflow-hidden flex flex-col sm:flex-row">
              {/* JSON side */}
              <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-[#0a0a0a] p-5 font-mono text-[10px] overflow-hidden border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col">
                <div className="text-white/40 mb-3 shrink-0">// schema.drawos</div>
                <div className="flex-grow overflow-auto custom-scrollbar text-white/70">
                  <pre>
                    <code>{`{
  "type": "Group",
  "id": "grp_alpha",
  "objects": [
    {
      "type": "rectangle",
      "id": "rect_1",
      "x": 20,
      "y": 20,
      "width": 100,
      "height": 100,
      "fill": "#e9edff",
      "stroke": "#004ac6"
    },
    {
      "type": "circle",
      "id": "circle_1",
      "cx": 120,
      "cy": 120,
      "r": 40,
      "fill": "#2563eb"
    }
  ]
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Visual side */}
              <div
                className="w-full sm:w-1/2 h-1/2 sm:h-full bg-surface-bright p-5 flex flex-col relative items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                <div className="text-[10px] font-mono text-on-surface-variant/40 absolute top-4 left-4">Visual Output</div>
                <div className="relative w-[140px] h-[140px]">
                  {/* Mock SVG Render */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <rect x="5" y="5" width="60" height="60" rx="4" fill="#e9edff" stroke="#004ac6" strokeWidth="2" />
                    <circle cx="65" cy="65" r="25" fill="#2563eb" stroke="#00174b" strokeWidth="1.5" fillOpacity="0.8" />
                  </svg>
                  {/* Selection Overlay */}
                  <div className="absolute top-[0px] left-[0px] w-[70px] h-[70px] border border-dashed border-primary pointer-events-none">
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-primary"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Minimal Footer */}
      <footer className="w-full bg-surface-bright border-t border-outline-variant/20 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              alt="DrawOS Logo"
              className="w-5 h-5 rounded grayscale opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QXkxy3sALdb0x34RktvYkaT9WCSYexYdwzjaq3puW41PwiPRxGfNpmVhwQgw2yGRMvgaPM93bzsB0rGdXewfzjdfO-SLdD6QEMjKUgYqGPcOT8hYrbxpSqFU5dCqwTxD0IV9W_5yp7pX6LJ40VWYlbPDwBCJZJ7OqFaVqa7hjFX2MQJHpOyx_EY_MrC_Eb-UxAcFQhCwN2hUvjqdQc8qzGXQ9AQ7K1oih6hv1IKklWiXv3uT-1AHGoLjmyReV517OFaGB2ZD9OIa"
            />
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              © 2026 DRAWOS ENGINE
            </span>
          </div>
          <div className="flex gap-8 text-[11px] font-semibold text-on-surface-variant tracking-wider">
            <a className="hover:text-on-surface transition-colors" href="#features">PRIVACY</a>
            <a className="hover:text-on-surface transition-colors" href="#features">TERMS</a>
            <a className="hover:text-on-surface transition-colors" href="#api">API</a>
            <a className="hover:text-on-surface transition-colors" href="#features">STATUS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
