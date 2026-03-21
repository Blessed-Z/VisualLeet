"use client";
import React, { useState, useEffect } from 'react';
import { RotateCcw, ExternalLink, Maximize2 } from 'lucide-react';

export function Visualizer({ htmlContent }: { htmlContent: string | null }) {
  const [reloadKey, setReloadKey] = useState(0);

  // 当内容改变时，重置 reloadKey
  useEffect(() => {
    setReloadKey(0);
  }, [htmlContent]);

  if (!htmlContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-950/50 border-2 border-dashed border-white/5 rounded-3xl text-zinc-600 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Maximize2 size={32} opacity={0.2} />
        </div>
        <p className="text-sm font-bold text-zinc-400">可视化预览区</p>
        <p className="text-xs mt-2 text-zinc-600 max-w-[240px] leading-relaxed">选择左侧题目或点击“一键分析”来生成算法动态演示。</p>
      </div>
    );
  }

  const handleReset = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] rounded-3xl overflow-hidden relative group">
      {/* Header / Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleReset}
          className="p-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white rounded-xl shadow-xl transition-all active:scale-95"
          title="重置动画"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <iframe
        key={reloadKey}
        srcDoc={htmlContent}
        title="Algorithm Visualization"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
}
