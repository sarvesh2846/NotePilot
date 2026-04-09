import React, { useEffect, useRef } from 'react';
import { Formula } from '../types';

interface FormulaSheetViewProps {
  formulas: Formula[];
}

const FormulaSheetView: React.FC<FormulaSheetViewProps> = ({ formulas }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
        console.warn('MathJax typesetting failed:', err);
      });
    }
  }, [formulas]);

  if (!formulas || formulas.length === 0) {
    return (
      <div className="text-center p-8 text-text-muted flex flex-col items-center justify-center h-64">
        <i className="fas fa-superscript text-4xl mb-4 opacity-20"></i>
        <p>No formulas extracted from this module.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-sidebar rounded-3xl shadow-2xl border border-border p-6 md:p-14 max-w-4xl mx-auto my-8 animate-fadeIn">
      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
         <div className="w-12 h-12 bg-rose-600/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-xl shrink-0">
           <i className="fas fa-square-root-alt text-xl"></i>
         </div>
         <div>
           <span className="text-rose-500 font-black text-[10px] uppercase tracking-widest md:tracking-[0.4em] mb-1 block">StudyEasierAI Module</span>
           <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">Extracted Formulas</h2>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formulas.map((f, i) => (
           <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-rose-500/50 transition-colors shadow-sm group">
              <div className="text-2xl mb-4 py-4 min-h-[80px] flex items-center justify-center overflow-x-auto w-full custom-scrollbar">
                \({f.equation}\)
              </div>
              <div className="w-full h-px bg-border group-hover:bg-rose-500/30 transition-colors mb-4"></div>
              <p className="text-sm text-text-muted font-medium">{f.explanation}</p>
           </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaSheetView;
