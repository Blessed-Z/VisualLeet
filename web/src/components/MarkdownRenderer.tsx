import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link, List, Code, Quote, Terminal, FileText, Hash } from 'lucide-react';

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="flex flex-col h-full bg-zinc-950/30">
      {/* 笔记工具栏 (Decorative) */}
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
            <span className="text-[10px] font-mono tracking-wider">NOTES.md</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-zinc-600">
          <Bold size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <Italic size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <div className="w-px h-3 bg-white/10"></div>
          <List size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <Quote size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
          <div className="w-px h-3 bg-white/10"></div>
          <Code size={14} className="hover:text-zinc-300 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
        <div className="prose prose-invert prose-zinc max-w-none 
          /* Fonts */
          font-sans
          
          /* Headings */
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
          prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-white/10 
          prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:via-white prose-h1:to-zinc-500 prose-h1:bg-clip-text prose-h1:text-transparent
          
          prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-violet-200 prose-h2:flex prose-h2:items-center 
          prose-h2:before:content-['#'] prose-h2:before:mr-2 prose-h2:before:text-violet-500/50 prose-h2:before:font-mono
          
          prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-zinc-200 prose-h3:font-medium
          
          /* Paragraphs */
          text-zinc-400 leading-8 text-[15px]
          
          /* Strong */
          prose-strong:text-fuchsia-300 prose-strong:font-semibold
          
          /* Links */
          prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-a:no-underline hover:prose-a:underline prose-a:decoration-violet-500/30
          
          /* Inline Code */
          prose-code:text-violet-200 prose-code:bg-white/[0.03] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/10 prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none
          
          /* Code Blocks */
          prose-pre:bg-[#0c0c0e] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:p-5 prose-pre:my-8 prose-pre:relative prose-pre:overflow-hidden
          
          /* Blockquotes (Callouts) */
          prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-zinc-300
          prose-blockquote:bg-gradient-to-r prose-blockquote:from-violet-500/10 prose-blockquote:to-transparent 
          prose-blockquote:border-l-2 prose-blockquote:border-violet-500 
          prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
          
          /* Lists */
          prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3
          prose-li:pl-6 prose-li:relative 
          prose-li:before:content-['✦'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-violet-500/60 prose-li:before:top-[0.6em] prose-li:before:text-[0.6em]
          
          prose-ol:list-decimal prose-ol:pl-5 prose-ol:marker:text-zinc-600 prose-ol:marker:font-mono prose-ol:marker:text-xs
          
          /* HR */
          prose-hr:border-white/10 prose-hr:my-10
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
