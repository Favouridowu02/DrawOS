import React, { useState, ReactNode } from 'react';
import { DOCS_ITEMS, DocItem } from './docsData';
import { BookOpen, ChevronRight, Copy, Check, Clock, Code, Settings, Terminal, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom lightweight Markdown renderer to support beautiful layouts without external library version clashes
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const parseInlineMarkdown = (text: string) => {
    // Basic regex-based parser for bold, inline code, and checkmarks
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    // Handle Completed Tasks [x] and Uncompleted Tasks [ ]
    if (currentText.startsWith('- [x] ') || currentText.startsWith('* [x] ')) {
      parts.push(
        <span key="task-checked" className="inline-flex items-center gap-2 text-primary font-medium">
          <span className="w-4 h-4 rounded bg-primary/10 border border-primary flex items-center justify-center text-[10px] font-bold">✓</span>
        </span>
      );
      currentText = currentText.slice(6);
    } else if (currentText.startsWith('- [ ] ') || currentText.startsWith('* [ ] ')) {
      parts.push(
        <span key="task-unchecked" className="inline-flex items-center gap-2 text-on-surface-variant/40">
          <span className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center text-[10px]"></span>
        </span>
      );
      currentText = currentText.slice(6);
    }

    // Parse bold (**text**) and inline code (`code`)
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const segments = currentText.split(regex);

    segments.forEach((seg, idx) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        parts.push(
          <strong key={`bold-${idx}-${keyIdx++}`} className="font-bold text-on-surface">
            {seg.slice(2, -2)}
          </strong>
        );
      } else if (seg.startsWith('`') && seg.endsWith('`')) {
        parts.push(
          <code key={`code-inline-${idx}-${keyIdx++}`} className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-[11px] text-primary border border-outline-variant/30">
            {seg.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(seg);
      }
    });

    return parts.length > 0 ? parts : text;
  };

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-group-${key}`} className="space-y-2.5 my-4 pl-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Block boundary
    if (line.trim().startsWith('```')) {
      flushList(`pre-code-${i}`);
      if (inCodeBlock) {
        // End code block
        const finalCode = codeLines.join('\n');
        elements.push(
          <CodeBlockContainer key={`code-block-${i}`} code={finalCode} language={codeLang} />
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      flushList(`h1-${i}`);
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl font-bold tracking-tight text-on-surface mt-2 mb-6 pb-3 border-b border-outline-variant/20">
          {line.slice(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList(`h2-${i}`);
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold tracking-tight text-on-surface mt-8 mb-4 flex items-center gap-2">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList(`h3-${i}`);
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-on-surface/90 mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      flushList(`hr-${i}`);
      elements.push(<hr key={`hr-${i}`} className="my-8 border-outline-variant/20" />);
      continue;
    }

    // Unordered list items and checklist items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      inList = true;
      const cleanContent = line.trim().slice(2);
      listItems.push(
        <li key={`li-${i}-${listItems.length}`} className="text-sm text-on-surface-variant flex items-start gap-2.5 leading-relaxed">
          {!line.includes('[x]') && !line.includes('[ ]') && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span>
          )}
          <span className="flex-1">{parseInlineMarkdown(cleanContent)}</span>
        </li>
      );
      continue;
    }

    // Ordered lists
    const orderedMatch = line.trim().match(/^(\d+)\.\s(.*)/);
    if (orderedMatch) {
      inList = true;
      const num = orderedMatch[1];
      const textVal = orderedMatch[2];
      listItems.push(
        <li key={`ol-${i}-${listItems.length}`} className="text-sm text-on-surface-variant flex items-start gap-2.5 leading-relaxed">
          <span className="font-mono text-xs font-bold text-primary shrink-0 min-w-[16px]">{num}.</span>
          <span className="flex-1">{parseInlineMarkdown(textVal)}</span>
        </li>
      );
      continue;
    }

    // Empty lines or paragraphs
    if (line.trim() === '') {
      flushList(`empty-${i}`);
    } else {
      flushList(`paragraph-transition-${i}`);
      elements.push(
        <p key={`p-${i}`} className="text-sm text-on-surface-variant leading-relaxed my-4">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Final flush in case document ends with list
  flushList('final');

  return <div className="space-y-1">{elements}</div>;
}

// Interactive Code Block with absolute path & copy state
function CodeBlockContainer({ code, language }: { code: string; language: string; key?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="group bg-[#090d16] border border-outline-variant/30 rounded-xl my-5 overflow-hidden shadow-md">
      {/* Header Bar */}
      <div className="h-9 bg-[#04060b] border-b border-outline-variant/20 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">
            {language || 'bash'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[10px] font-medium transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Text */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-white/85 leading-relaxed selection:bg-white/15">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function DocsBrowser() {
  const [selectedId, setSelectedId] = useState<string>('introduction');

  // Group items by Category
  const categories = DOCS_ITEMS.reduce<Record<string, DocItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const currentDoc = DOCS_ITEMS.find((d) => d.id === selectedId) || DOCS_ITEMS[0];

  return (
    <div className="w-full flex flex-col md:flex-row bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden min-h-[580px] shadow-lg">
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-outline-variant/30 bg-surface-container-low flex flex-col shrink-0">
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-lowest/50 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-on-surface tracking-tight uppercase">Documentation</span>
        </div>

        <div className="p-3 flex-1 space-y-5 overflow-y-auto custom-scrollbar">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider block">
                {category}
              </span>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = item.id === selectedId;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex justify-between items-center cursor-pointer ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                      >
                        <span>{item.title}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 bg-surface-bright flex flex-col relative min-h-[400px]">
        {/* Upper Meta-info Strip */}
        <div className="h-12 border-b border-outline-variant/20 px-6 flex justify-between items-center bg-surface-container-lowest/30 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-wider font-mono">
            <span>DrawOS Docs</span>
            <span>/</span>
            <span className="text-primary font-bold">{currentDoc.category}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-on-surface-variant/60 font-mono">
            <Clock className="w-3 h-3 text-on-surface-variant/40" />
            <span>{currentDoc.readingTime}</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-grow p-6 md:p-8 overflow-y-auto max-w-3xl custom-scrollbar selection:bg-primary-container selection:text-on-primary">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <MarkdownRenderer content={currentDoc.content} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
