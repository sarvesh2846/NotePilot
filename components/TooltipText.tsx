import React, { useState, useRef, useEffect } from 'react';

interface TooltipTextProps {
  text: string;
  glossary: { term: string; definition: string }[];
}

const TooltipText: React.FC<TooltipTextProps> = ({ text, glossary }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format inline markdown for strings
  const formatTextWithMarkdown = (str: string, indexOffset: number) => {
    const elements: React.ReactNode[] = [];
    let lastIdx = 0;
    const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        elements.push(str.substring(lastIdx, match.index));
      }
      
      if (match[1]) {
        elements.push(
          <strong key={`bold-${indexOffset}-${match.index}`} className="font-bold text-emerald-400 print:text-black">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        elements.push(
          <em key={`italic-${indexOffset}-${match.index}`} className="italic text-text-muted print:text-gray-600">
            {match[4]}
          </em>
        );
      }
      lastIdx = regex.lastIndex;
    }
    
    if (lastIdx < str.length) {
      elements.push(str.substring(lastIdx));
    }
    
    return elements;
  };

  if (!glossary || glossary.length === 0) {
    return <span>{formatTextWithMarkdown(text, 0)}</span>;
  }

  // Create a regex to match terms (case-insensitive, whole word, with optional trailing plurals)
  // Sort by length descending to match longest terms first
  const terms = glossary.map(g => g.term).sort((a, b) => b.length - a.length);
  const regexPattern = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^$\{()|[\]\\]/g, '\\$&')).join('|')})(?:s|es)?\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regexPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
          const textPart = text.substring(lastIndex, match.index);
          parts.push(...formatTextWithMarkdown(textPart, lastIndex));
      }
      
      const fullMatch = match[0];
      const rootTerm = match[1];
      const termData = glossary.find(g => g.term.toLowerCase() === rootTerm.toLowerCase());

      if (termData) {
          parts.push(
              <span key={match.index} className="relative inline-block" onMouseEnter={() => setActiveTooltip(termData.term)} onMouseLeave={() => setActiveTooltip(null)}>
                  <span className="cursor-help border-b border-dashed border-indigo-400 text-indigo-300 hover:text-indigo-400 transition-colors">
                      {fullMatch}
                  </span>
                  {activeTooltip === termData.term && (
                      <div className="absolute z-[100] bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface2 border border-border rounded-xl p-3 shadow-2xl text-left pointer-events-none animate-fadeIn">
                          <p className="text-xs font-black text-indigo-400 mb-1">{termData.term}</p>
                          <p className="text-xs text-text-main leading-relaxed">{termData.definition}</p>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface2"></div>
                      </div>
                  )}
              </span>
          );
      } else {
          // Fallback if not found
          parts.push(fullMatch);
      }

      lastIndex = regexPattern.lastIndex;
  }

  if (lastIndex < text.length) {
      const textPart = text.substring(lastIndex);
      parts.push(...formatTextWithMarkdown(textPart, lastIndex));
  }

  return <span ref={containerRef}>{parts}</span>;
};

export default TooltipText;
