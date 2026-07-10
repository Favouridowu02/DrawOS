import { X, Sparkles, Cpu, Globe, Database } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface-bright border border-outline-variant rounded-xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h2 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
            About DrawOS Engine
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              alt="DrawOS Logo"
              className="w-14 h-14 rounded-xl border border-outline-variant shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QXkxy3sALdb0x34RktvYkaT9WCSYexYdwzjaq3puW41PwiPRxGfNpmVhwQgw2yGRMvgaPM93bzsB0rGdXewfzjdfO-SLdD6QEMjKUgYqGPcOT8hYrbxpSqFU5dCqwTxD0IV9W_5yp7pX6LJ40VWYlbPDwBCJZJ7OqFaVqa7hjFX2MQJHpOyx_EY_MrC_Eb-UxAcFQhCwN2hUvjqdQc8qzGXQ9AQ7K1oih6hv1IKklWiXv3uT-1AHGoLjmyReV517OFaGB2ZD9OIa"
            />
            <div>
              <h3 className="text-sm font-bold text-on-surface">DrawOS Engine</h3>
              <p className="text-[10px] font-mono text-secondary">Version 2.0.4 (Client Stable)</p>
              <p className="text-[10px] font-semibold text-primary mt-1">Built for high-precision geometries</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              DrawOS is a professional open-source drawing engine for vector graphics. Built on top of client-side React 19, custom SVG layout algorithms, and modern Tailwind CSS, it offers a fast, zero-dependency visual drafting board.
            </p>

            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Tech Stack & Features</span>
              
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">Precision SVGs</span>
                    <p className="text-[10px] text-secondary">Direct mathematical elements with customizable weights, scales, and curves.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Database className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">Local-First Persistence</span>
                    <p className="text-[10px] text-secondary">No databases or active servers required. State is autosaved in local browser caches.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">Standard JSON Schema</span>
                    <p className="text-[10px] text-secondary">Export drafts as lightweight, portable data configurations compatible with other CAD tools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer"
          >
            Acknowledge Engine
          </button>
        </div>

      </div>
    </div>
  );
}
