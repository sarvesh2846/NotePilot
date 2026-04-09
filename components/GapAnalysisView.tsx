import React from 'react';
import { KnowledgeGap } from '../types';

interface GapAnalysisViewProps {
  gaps: KnowledgeGap[];
}

const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="text-center p-8 text-text-muted flex flex-col items-center justify-center h-64">
        <i className="fas fa-check-circle text-4xl mb-4 text-emerald-500/50"></i>
        <p>No significant knowledge gaps identified.</p>
      </div>
    );
  }

  return (
    <div className="bg-sidebar rounded-3xl shadow-2xl border border-border p-6 md:p-14 max-w-4xl mx-auto my-8 animate-fadeIn">
      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
         <div className="w-12 h-12 bg-amber-600/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shrink-0">
           <i className="fas fa-tools text-xl"></i>
         </div>
         <div>
           <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest md:tracking-[0.4em] mb-1 block">AI Analysis</span>
           <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">Knowledge Gaps</h2>
         </div>
      </div>
      
      <div className="space-y-6">
        {gaps.map((gap, i) => (
           <div key={i} className="bg-surface border-l-4 border-amber-500 rounded-r-2xl p-6 hover:bg-surface2 transition-colors">
              <h3 className="text-lg font-bold text-amber-400 mb-2">{gap.concept}</h3>
              <div className="mb-4">
                 <span className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1 block">Missing Information:</span>
                 <p className="text-sm text-text-muted leading-relaxed">{gap.missingInfo}</p>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl">
                 <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1 block flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i> Next Step:
                 </span>
                 <p className="text-sm text-text-main font-medium">{gap.suggestion}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default GapAnalysisView;
