"use client";

import { useState, useEffect, useMemo, memo } from 'react';
import { Book, Hash, Star, Search, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Problem {
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  tags: string[];
}

interface ProblemLibraryProps {
  onSelect: (slug: string) => void;
  selectedSlug?: string;
}

const ProblemLibraryComponent = memo(function ProblemLibrary({ onSelect, selectedSlug }: ProblemLibraryProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/data/hot100/registry.json')
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error("Failed to load registry:", err));
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(problems.map(p => p.category)))], [problems]);

  const filteredProblems = useMemo(() => problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.category === filter;
    return matchesSearch && matchesFilter;
  }), [problems, search, filter]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-white/5 w-72 shrink-0">
      <div className="p-4 border-b border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Book size={18} className="text-violet-500" />
          <span className="text-sm font-bold uppercase tracking-widest">Hot 100 百科</span>
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input 
            type="text" 
            placeholder="搜索题目..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-violet-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-medium transition-all",
                filter === cat ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredProblems.map(p => (
          <button
            key={p.slug}
            onClick={() => onSelect(p.slug)}
            className={clsx(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
              selectedSlug === p.slug 
                ? "bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]" 
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            <div className="flex flex-col items-start gap-1">
              <span className={clsx(
                "text-xs font-medium transition-colors",
                selectedSlug === p.slug ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
              )}>
                {p.title}
              </span>
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "text-[9px] px-1.5 py-0.5 rounded uppercase font-bold",
                  p.difficulty === 'Easy' ? "text-emerald-500 bg-emerald-500/10" :
                  p.difficulty === 'Medium' ? "text-amber-500 bg-amber-500/10" : "text-rose-500 bg-rose-500/10"
                )}>
                  {p.difficulty}
                </span>
                <span className="text-[9px] text-zinc-600">{p.category}</span>
              </div>
            </div>
            <ChevronRight size={14} className={clsx(
              "transition-all",
              selectedSlug === p.slug ? "text-violet-500 translate-x-0" : "text-zinc-800 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
});

export default ProblemLibraryComponent;
