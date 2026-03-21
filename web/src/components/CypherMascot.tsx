"use client";
import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MascotStatus = 'idle' | 'thinking' | 'typing' | 'success' | 'error';

interface CypherMascotProps {
  status: MascotStatus;
}

// 使用 memo 包装，只有状态变化时才重新渲染
export const CypherMascot = memo(({ status }: CypherMascotProps) => {
  const current = useMemo(() => {
    const colors = {
      idle: { primary: '#9d4edd', secondary: '#c8b6ff', glow: '#9d4edd' },
      thinking: { primary: '#ffbe0b', secondary: '#ffea00', glow: '#ffbe0b' },
      typing: { primary: '#06d6a0', secondary: '#b9fbc0', glow: '#06d6a0' },
      success: { primary: '#ff006e', secondary: '#ff85a1', glow: '#ff006e' },
      error: { primary: '#ef233c', secondary: '#ffb3c1', glow: '#ef233c' },
    };
    return colors[status] || colors.idle;
  }, [status]);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center" style={{ transform: 'translateZ(0)' }}>
      {/* 优化点 1: 移除 blur 滤镜，改用 SVG 渐变模拟光环 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor={current.glow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={current.glow} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle 
          cx="50%" cy="50%" r="40%" 
          fill="url(#glowGradient)"
          className="animate-glow-pulse" // 使用 CSS 动画
        />
      </svg>

      {/* 优化点 2: 核心动画改为 CSS，减轻 JS 计算压力 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .animate-mascot-float { animation: float 3s ease-easeInOut infinite; }
        .animate-glow-pulse { animation: glow 4s ease-in-out infinite; transform-origin: center; }
        .spin-slow { animation: spin 3s linear infinite; transform-origin: center; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="relative z-10 animate-mascot-float">
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* 身体 */}
          <path
            d="M20 45C20 25 35 15 50 15C65 15 80 25 80 45V70C80 80 70 85 50 85C30 85 20 80 20 70V45Z"
            fill="#09090b"
            stroke={current.primary}
            strokeWidth="3"
          />
          
          {/* 猫耳 */}
          <path d="M25 22L15 5L35 18" stroke={current.primary} strokeWidth="3" strokeLinecap="round" fill="#09090b" />
          <path d="M75 22L85 5L65 18" stroke={current.primary} strokeWidth="3" strokeLinecap="round" fill="#09090b" />

          {/* 眼睛系统 */}
          <g>
            {status === 'idle' && (
              <>
                <circle cx="35" cy="45" r="5" fill={current.primary} />
                <circle cx="65" cy="45" r="5" fill={current.primary} />
                <circle cx="37" cy="43" r="1.5" fill="white" />
                <circle cx="67" cy="43" r="1.5" fill="white" />
              </>
            )}
            {status === 'thinking' && (
              <>
                <g className="spin-slow" style={{ transformOrigin: '35px 45px' }}>
                   <path d="M30 45Q35 35 40 45" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
                </g>
                <g className="spin-slow" style={{ transformOrigin: '65px 45px', animationDirection: 'reverse' }}>
                   <path d="M60 45Q65 35 70 45" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
                </g>
              </>
            )}
            {status === 'typing' && (
              <>
                <path d="M30 42L40 48M40 42L30 48" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
                <path d="M60 42L70 48M70 42L60 48" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
              </>
            )}
            {status === 'success' && (
              <>
                <path d="M30 48Q35 38 40 48" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
                <path d="M60 48Q65 38 70 48" stroke={current.primary} strokeWidth="4" strokeLinecap="round" />
                <circle cx="35" cy="55" r="3" fill={current.secondary} opacity="0.4" />
                <circle cx="65" cy="55" r="3" fill={current.secondary} opacity="0.4" />
              </>
            )}
            {status === 'error' && (
              <>
                <path d="M30 42L40 48M40 42L30 48" stroke={current.primary} strokeWidth="3" />
                <path d="M60 42L70 48M70 42L60 48" stroke={current.primary} strokeWidth="3" />
                <path d="M45 60Q50 55 55 60" stroke={current.primary} strokeWidth="2" />
              </>
            )}
          </g>
        </svg>
      </div>

      {/* 情绪挂件 - 仅在必要时渲染 */}
      <div className="absolute top-0 right-0 pointer-events-none z-20">
        <AnimatePresence>
          {status === 'success' && (
            <motion.div key="s" initial={{ scale: 0 }} animate={{ scale: 1, y: -10 }} exit={{ scale: 0 }} className="text-sm">✨</motion.div>
          )}
          {status === 'error' && (
            <motion.div key="e" animate={{ x: [0, -1, 1, 0] }} transition={{ repeat: Infinity, duration: 0.2 }} className="text-sm">💢</motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

CypherMascot.displayName = 'CypherMascot';
