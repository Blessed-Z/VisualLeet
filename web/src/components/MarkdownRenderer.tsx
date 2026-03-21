import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link, List, Code, Quote, Terminal, FileText, Hash } from 'lucide-react';
import clsx from 'clsx';

interface MarkdownRendererProps {
  content: string;
  variant?: 'note' | 'chat';
}

export function MarkdownRenderer({ content, variant = 'note' }: MarkdownRendererProps) {
  if (!content) return null;

  const isNote = variant === 'note';

  return (
    <div className={clsx(
      "flex flex-col w-full min-w-0 overflow-hidden",
      isNote ? "h-full bg-zinc-950/30" : "bg-transparent"
    )}>
      {/* 笔记工具栏 (Only for Note mode) */}
      {isNote && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] backdrop-blur-md shrink-0 select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.4)]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.4)]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.4)]"></div>
            </div>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <div className="flex items-center gap-1 text-zinc-500">
              <FileText size={12} className="text-violet-400" />
              <span className="text-[10px] font-mono tracking-wider uppercase">Problem Insights</span>
            </div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className={clsx(
        "scroll-smooth custom-scrollbar w-full min-w-0",
        isNote ? "flex-1 overflow-y-auto p-8" : "p-0 overflow-visible"
      )}>
        <div className={clsx(
          "prose prose-invert prose-zinc max-w-full break-words font-sans",
          isNote ? "prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-white/10 prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:via-white prose-h1:to-zinc-500 prose-h1:bg-clip-text prose-h1:text-transparent" : "prose-sm prose-h1:text-xl prose-h1:mb-4",
          "prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-violet-200 prose-h2:flex prose-h2:items-center",
          "prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-zinc-200 prose-h3:font-medium",
          "text-zinc-300 leading-relaxed",
          /* Tables support (basic CSS, might not render without GFM plugin but avoids crash) */
          "prose-table:border prose-table:border-white/10 prose-table:rounded-lg prose-th:bg-white/5 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-white/5",
          /* Code Blocks */
          "prose-pre:bg-[#0c0c0e] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto",
          /* Lists */
          "prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5"
        )}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
