import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MindMapViewProps {
  mindmap: string;
}

const MindMapView: React.FC<MindMapViewProps> = ({ mindmap }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mindmap) return;

    // Clean up potential markdown formatting from AI output
    const cleanMindmap = mindmap
      .replace(/^```mermaid\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '')
      .trim();

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });

    const uniqueId = `mindmap-svg-${Math.random().toString(36).substr(2, 9)}`;

    if (containerRef.current) {
      mermaid.render(uniqueId, cleanMindmap).then((res) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = res.svg;
        }
      }).catch(err => {
         console.warn("Mermaid parsing error:", err);
         if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="text-rose-500 font-bold p-4 text-center">Failed to render mind map from AI output.</div><pre class="text-xs text-text-muted mt-4 bg-surface2 p-4 rounded overflow-auto">${cleanMindmap}</pre>`;
         }
      });
    }
  }, [mindmap]);

  const handleDownload = () => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindmap.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  if (!mindmap) {
    return (
      <div className="text-center p-8 text-text-muted flex flex-col items-center justify-center h-64">
        <i className="fas fa-project-diagram text-4xl mb-4 opacity-20"></i>
        <p>No mind map generated for this session.</p>
      </div>
    );
  }

  return (
    <div className="bg-sidebar rounded-3xl shadow-2xl border border-border p-6 md:p-14 max-w-5xl mx-auto my-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-border">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 shrink-0">
             <i className="fas fa-project-diagram text-xl"></i>
           </div>
           <div>
             <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest md:tracking-[0.4em] mb-1 block">StudyEasierAI Visual</span>
             <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">Knowledge Graph</h2>
           </div>
         </div>
         
         <button 
            onClick={handleDownload}
            className="text-emerald-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 rounded-xl"
         >
            <i className="fas fa-download mr-2"></i> SVG
         </button>
      </div>
      
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 flex justify-center">
         <div ref={containerRef} className="min-w-[600px] w-full flex justify-center mermaid-container transition-all">
            {/* Mermaid SVG injected here */}
         </div>
      </div>
      
      <style>{`
         .mermaid-container svg {
             max-width: 100%;
             height: auto;
         }
      `}</style>
    </div>
  );
};

export default MindMapView;
