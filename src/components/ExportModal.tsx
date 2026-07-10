import { useState } from 'react';
import { Download, FileCode, ImageIcon, X, Check, Copy } from 'lucide-react';
import { Drawing, CanvasSettings } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawing: Drawing;
  canvasSettings: CanvasSettings;
}

export default function ExportModal({ isOpen, onClose, drawing, canvasSettings }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'json' | 'svg'>('png');
  const [bgType, setBgType] = useState<'transparent' | 'filled'>('filled');
  const [exportScale, setExportScale] = useState<number>(2); // Multiplier: 1x, 2x, 3x

  if (!isOpen) return null;

  // Generate clean SVG representation
  const generateSVGString = (isTransparent: boolean) => {
    let width = 800;
    let height = 600;

    // Auto-calculate bounds based on objects or use 800x600 default
    if (drawing.objects.length > 0) {
      let maxX = 800;
      let maxY = 600;
      drawing.objects.forEach(obj => {
        const x = obj.x + (obj.width || obj.radius || 0);
        const y = obj.y + (obj.height || obj.radius || 0);
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
      width = Math.ceil(maxX + 50);
      height = Math.ceil(maxY + 50);
    }

    const svgBg = isTransparent ? '' : `<rect width="100%" height="100%" fill="#f9f9ff" />`;

    const svgElements = drawing.objects.map(obj => {
      switch (obj.type) {
        case 'rectangle':
          return `<rect x="${obj.x}" y="${obj.y}" width="${obj.width || 0}" height="${obj.height || 0}" rx="4" fill="${obj.fill}" stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}" />`;
        case 'circle':
          return `<circle cx="${obj.x}" cy="${obj.y}" r="${obj.radius || 0}" fill="${obj.fill}" stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}" />`;
        case 'text':
          return `<text x="${obj.x}" y="${obj.y}" fill="${obj.stroke}" font-family="Geist, sans-serif" font-size="16" font-weight="500">${obj.text || ''}</text>`;
        case 'image':
          return `<image x="${obj.x}" y="${obj.y}" width="${obj.width || 0}" height="${obj.height || 0}" href="${obj.imageUrl || ''}" />`;
        case 'path':
          return `<path d="${obj.points || ''}" fill="${obj.fill}" stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
        default:
          return '';
      }
    }).join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${svgBg}
  ${svgElements}
</svg>`;
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(drawing, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(drawing, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${canvasSettings.filename || 'drawing'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportSVG = () => {
    const isTransparent = bgType === 'transparent';
    const svgStr = generateSVGString(isTransparent);
    const dataStr = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${canvasSettings.filename || 'drawing'}.svg`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPNG = () => {
    const isTransparent = bgType === 'transparent';
    const svgStr = generateSVGString(isTransparent);

    // Create an image element
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Calculate Canvas Size (scaled up for high-res)
      const canvas = document.createElement('canvas');
      const scale = exportScale;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        // Clear Rect
        ctx.clearRect(0, 0, img.width, img.height);
        
        if (!isTransparent) {
          ctx.fillStyle = "#f9f9ff";
          ctx.fillRect(0, 0, img.width, img.height);
        }

        ctx.drawImage(img, 0, 0);

        // Download link
        const pngUrl = canvas.toDataURL('image/png');
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", pngUrl);
        downloadAnchor.setAttribute("download", `${canvasSettings.filename || 'drawing'}.png`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="fixed inset-0 bg-[#000]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface-bright border border-outline-variant rounded-xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h2 className="text-sm font-bold text-on-surface">Export Workspace</h2>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Export Type Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Format</span>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportType('png')}
                className={`py-3 px-4 rounded-lg border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportType === 'png'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/60 text-secondary hover:border-outline'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                PNG Image
              </button>
              
              <button
                onClick={() => setExportType('svg')}
                className={`py-3 px-4 rounded-lg border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportType === 'svg'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/60 text-secondary hover:border-outline'
                }`}
              >
                <FileCode className="w-5 h-5" />
                SVG Vector
              </button>

              <button
                onClick={() => setExportType('json')}
                className={`py-3 px-4 rounded-lg border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportType === 'json'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/60 text-secondary hover:border-outline'
                }`}
              >
                <FileCode className="w-5 h-5" />
                Raw JSON
              </button>
            </div>
          </div>

          {/* Conditional Options based on export format */}
          {exportType === 'png' && (
            <div className="space-y-4">
              {/* Background Style */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Background</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBgType('filled')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      bgType === 'filled'
                        ? 'border-on-surface bg-surface-container text-on-surface'
                        : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    Solid Canvas
                  </button>
                  <button
                    onClick={() => setBgType('transparent')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      bgType === 'transparent'
                        ? 'border-on-surface bg-surface-container text-on-surface'
                        : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    Transparent
                  </button>
                </div>
              </div>

              {/* Quality Multiplier */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Resolution Scale</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setExportScale(scale)}
                      className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        exportScale === scale
                          ? 'border-on-surface bg-surface-container text-on-surface'
                          : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                      }`}
                    >
                      {scale}x ({scale * 800}px width)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {exportType === 'svg' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Canvas Color</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBgType('filled')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      bgType === 'filled'
                        ? 'border-on-surface bg-surface-container text-on-surface'
                        : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    Include Solid BG
                  </button>
                  <button
                    onClick={() => setBgType('transparent')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      bgType === 'transparent'
                        ? 'border-on-surface bg-surface-container text-on-surface'
                        : 'border-outline-variant/60 text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    Transparent Path Vector
                  </button>
                </div>
              </div>
            </div>
          )}

          {exportType === 'json' && (
            <div className="space-y-3">
              <p className="text-[11px] text-secondary leading-relaxed">
                Raw JSON saves your complete layout list and allows re-importing later inside any browser session with full geometric layers intact.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyJSON}
                  className="flex-1 py-2.5 border border-outline bg-transparent text-on-surface text-xs font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied State!' : 'Copy Schema to Clipboard'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/40 flex justify-between items-center">
          <span className="text-[10px] font-mono text-secondary">
            {drawing.objects.length} elements mapped
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-secondary hover:text-on-surface cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={
                exportType === 'png'
                  ? handleExportPNG
                  : exportType === 'svg'
                  ? handleExportSVG
                  : handleExportJSON
              }
              className="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
