"use client";
import React from 'react';

export function Visualizer({ htmlContent }: { htmlContent: string | null }) {
  if (!htmlContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">可视化预览区</p>
        <p className="text-xs mt-1 text-gray-500">点击 "可视化演示" 按钮查看算法动态运行效果。</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <iframe
        srcDoc={htmlContent}
        title="Algorithm Visualization"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
}
