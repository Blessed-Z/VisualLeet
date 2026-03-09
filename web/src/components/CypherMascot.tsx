"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MascotStatus = 'idle' | 'thinking' | 'typing' | 'success' | 'error';

interface CypherMascotProps {
  status: MascotStatus;
  className?: string;
}

export function CypherMascot({ status, className }: CypherMascotProps) {
  // 赛芙 (Cypher) 的原创设计：赛博风连帽衫少女
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* 状态对话气泡 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          className="absolute -top-12 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] text-zinc-300 font-medium"
        >
          {status === 'idle' && "准备好了！"}
          {status === 'thinking' && "正在解析逻辑..."}
          {status === 'typing' && "正在生成代码..."}
          {status === 'success' && "搞定了！太棒了"}
          {status === 'error' && "哎呀，出错了..."}
        </motion.div>
      </AnimatePresence>

      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 身体/连帽衫 */}
        <motion.path
          d="M30 110C30 90 40 70 60 70C80 70 90 90 90 110"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-violet-500/30"
          animate={status === 'typing' ? { d: ["M30 110C30 90 40 70 60 70C80 70 90 90 90 110", "M30 108C30 88 40 68 60 68C80 68 90 88 90 108"] } : {}}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* 头部背景 */}
        <circle cx="60" cy="45" r="30" className="fill-zinc-900 stroke-violet-500/50" strokeWidth="2" />
        
        {/* 赛博耳机/兜帽边框 */}
        <motion.path
          d="M35 50C35 30 45 15 60 15C75 15 85 30 85 50"
          stroke="currentColor"
          strokeWidth="3"
          className="text-violet-500"
          animate={status === 'thinking' ? { strokeDasharray: ["0 100", "100 0"] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* 脸部表情 */}
        <g className="text-zinc-200">
          {/* 眼睛 */}
          {status === 'idle' && (
            <>
              <motion.circle cx="50" cy="45" r="2" fill="currentColor" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] }} />
              <motion.circle cx="70" cy="45" r="2" fill="currentColor" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] }} />
            </>
          )}
          {status === 'thinking' && (
            <>
              <motion.path d="M48 45H52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
              <motion.path d="M68 45H72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
            </>
          )}
          {status === 'typing' && (
            <>
              <text x="45" y="48" fontSize="8" fill="currentColor" className="font-mono">{'<'}</text>
              <text x="65" y="48" fontSize="8" fill="currentColor" className="font-mono">{'>'}</text>
              <motion.path 
                d="M40 75H80" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeDasharray="2 2"
                animate={{ x: [-10, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
              />
            </>
          )}
          {status === 'success' && (
            <>
              <path d="M45 45C45 45 48 42 50 42C52 42 55 45 55 45" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <path d="M65 45C65 45 68 42 70 42C72 42 75 45 75 45" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <motion.path d="M55 55C55 55 58 58 60 58C62 58 65 55 65 55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {status === 'error' && (
            <>
              <path d="M47 43L53 49M53 43L47 49" stroke="#ef4444" strokeWidth="2" />
              <path d="M67 43L73 49M73 43L67 49" stroke="#ef4444" strokeWidth="2" />
              <motion.path d="M55 58H65" stroke="#ef4444" strokeWidth="2" animate={{ x: [-1, 1] }} transition={{ repeat: Infinity, duration: 0.1 }} />
            </>
          )}
          
          {/* 嘴巴 (通用) */}
          {status !== 'success' && status !== 'error' && (
            <motion.path
              d="M57 55H63"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={status === 'typing' ? { d: ["M57 55H63", "M56 56H64"] } : {}}
            />
          )}
        </g>

        {/* 装饰：周围飘动的代码碎片 */}
        {(status === 'typing' || status === 'thinking') && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={20 + i * 40}
                cy="20"
                r="1"
                fill="#8b5cf6"
                animate={{
                  y: [0, 80],
                  opacity: [0, 1, 0],
                  x: [0, (i - 1) * 10]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.4,
                  ease: "linear"
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
