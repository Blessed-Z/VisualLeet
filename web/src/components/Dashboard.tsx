"use client";

import React from 'react';
import { Sparkles, Wrench, Star, ArrowRight, Zap, Code2, BookMarked, MessageSquare, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onAction: (action: 'analyze' | 'fix' | 'favorites') => void;
}

function DashboardComponent({ onAction }: DashboardProps) {
  const cards = [
    {
      id: 'analyze',
      title: '分析新题目',
      desc: '粘贴 LeetCode 链接或题目描述，让团子为你生成可视化动画与深度解析。',
      icon: <Sparkles className="text-violet-400" size={24} />,
      bg: 'from-violet-500/10 to-fuchsia-500/5',
      border: 'border-violet-500/20',
      tag: '最常用'
    },
    {
      id: 'fix',
      title: '代码诊断',
      desc: '粘贴你的算法代码，获取实时修复建议、复杂度分析以及“小朋友版”注释。',
      icon: <Code2 className="text-emerald-400" size={24} />,
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20',
      tag: 'Debug'
    },
    {
      id: 'favorites',
      title: '我的收藏',
      desc: '查看你保存的所有精品笔记、思路巧记和基础百科，温故而知新。',
      icon: <Star className="text-amber-400" size={24} />,
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20',
      tag: '知识库'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black p-8 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <a 
              href="https://github.com/Blessed-Z/VisualLeet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 text-xs hover:text-white hover:border-white/10 transition-all active:scale-95"
            >
              <Github size={16} />
              <span>本项开源在 GitHub</span>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            </a>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Zap size={12} /> Powered by Tuanzi AI
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            欢迎回来，<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">准备好开始刷题了吗？</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed px-4">
            选择左侧 Hot 100 经典题目，或通过下方卡片开启一次全新的 AI 算法探索之旅。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {cards.map((card, idx) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onAction(card.id as any)}
              className={`group relative flex flex-col text-left p-6 rounded-3xl border ${card.border} bg-gradient-to-br ${card.bg} hover:scale-[1.02] transition-all duration-300 shadow-2xl`}
            >
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-black/40 text-[9px] font-bold text-zinc-500 border border-white/5">
                {card.tag}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/10 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                {card.title}
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-500" />
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {card.desc}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/5 pt-12 px-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5">
              <BookMarked className="text-zinc-500" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-300 mb-1">离线百科</h4>
              <p className="text-[11px] text-zinc-600 leading-relaxed">无需 API Key，随时查阅 Hot 100 经典题解与可视化演示。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5">
              <Github className="text-zinc-500" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-300 mb-1">本地部署</h4>
              <p className="text-[11px] text-zinc-600 leading-relaxed">克隆仓库到本地，配置你的 API Key，即可解锁无限次的实时代码诊断与分析功能。</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardComponent;
