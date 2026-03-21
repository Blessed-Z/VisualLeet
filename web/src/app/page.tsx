"use client";

import { useState, useEffect, useRef } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Visualizer } from '@/components/Visualizer';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CypherMascot, MascotStatus } from '@/components/CypherMascot';
import { 
  Play, BookOpen, Wrench, Loader2, Code2, 
  Lightbulb, Star, History, Trash2, X, Send, Square,
  Layout, Sparkles, MessageSquare, Plus, PanelLeftClose, PanelLeftOpen, Bookmark, Info, Edit3, Home as HomeIcon, PanelRightClose, PanelRightOpen, RefreshCw, Github
} from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { getHistory, saveHistory, toggleFavorite, deleteHistoryItem } from '@/lib/storage';
import { HistoryItem, TaskResult, AnalysisState, TaskType, ChatMessage } from '@/types';
import { ProblemLibrary } from '@/components/ProblemLibrary';
import { Dashboard } from '@/components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

const initialTaskState: TaskResult = { content: '', isLoading: false };

export default function Home() {
  // --- State ---
  const [problemDescription, setProblemDescription] = useState('');
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [userMsgInput, setUserMsgInput] = useState('');
  const [mascotStatus, setMascotStatus] = useState<MascotStatus>('idle');
  const [currentProblemSlug, setCurrentProblemSlug] = useState<string | undefined>();
  const [availableSolutions, setAvailableSolutions] = useState<any[]>([]);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [showDashboard, setShowDashboard] = useState(true);
  const [overlayTab, setOverlayTab] = useState<'history' | 'favorites'>('history');
  const [customTitle, setCustomTitle] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<AnalysisState>({
    visualize: { ...initialTaskState },
    fix: { ...initialTaskState },
    explain: { ...initialTaskState },
    tips: { ...initialTaskState },
    complexity: { ...initialTaskState },
    fundamentals: { ...initialTaskState },
    chat: { messages: [], isLoading: false }
  });

  const [activeTab, setActiveTab] = useState<TaskType | 'input'>('visualize');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentId, setCurrentId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results.chat.messages]);

  useEffect(() => {
    setHistory(getHistory());
    if (!currentId) setCurrentId(uuidv4());
  }, []);

  // --- Helpers ---
  const extractTitleFromMarkdown = (md: string) => {
    const match = md.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : '';
  };

  const inferTitleFromCode = (code: string) => {
    // Look for all potential function names and pick the most meaningful one
    const matches = Array.from(code.matchAll(/(?:def|function|class)\s+([a-zA-Z0-9_]+)/g))
      .map(m => m[1])
      .filter(name => !['__init__', 'ListNode', 'Node', 'Solution', 'self', 'main'].includes(name));
    
    const name = matches[0]; // Take the first meaningful one
    if (!name) return '';
    
    // Convert snake_case or camelCase to Space Case with Capitalization
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getProblemTitle = () => {
    if (customTitle) return customTitle;
    const inferred = inferTitleFromCode(userCode);
    if (inferred) return inferred;
    const extracted = extractTitleFromMarkdown(results.explain.content);
    if (extracted) return extracted;
    if (currentProblemSlug) return currentProblemSlug.replace(/-/g, ' ').toUpperCase();
    return problemDescription.substring(0, 30).replace(/\n/g, ' ') || "未命名题目";
  };

  // --- Actions ---
  const handleResetToHome = () => {
    setShowDashboard(true);
    setCurrentProblemSlug(undefined);
    setProblemDescription('');
    setUserCode('');
    setAvailableSolutions([]);
    setCustomTitle('');
    setResults({
      visualize: { ...initialTaskState }, fix: { ...initialTaskState },
      explain: { ...initialTaskState }, tips: { ...initialTaskState },
      complexity: { ...initialTaskState }, fundamentals: { ...initialTaskState },
      chat: { messages: [], isLoading: false }
    });
    setMascotStatus('idle');
    setCurrentId(uuidv4());
    setIsFavorite(false);
  };

  const handleDashboardAction = (action: 'analyze' | 'fix' | 'favorites') => {
    if (action === 'favorites') { setOverlayTab('favorites'); setShowHistory(true); return; }
    setShowDashboard(false);
    setActiveTab('input');
  };

  const handleSelectProblem = async (slug: string) => {
    setShowDashboard(false);
    setCurrentProblemSlug(slug);
    setMascotStatus('thinking');
    try {
      const infoRes = await fetch(`/data/hot100/${slug}/info.json`);
      const info = await infoRes.json();
      setProblemDescription(info.description);
      setAvailableSolutions(info.solutions || []);
      setSelectedSolutionIndex(0);
      setCustomTitle(info.title || '');

      const hist = getHistory();
      const existing = hist.find(h => h.problemDescription === info.description);
      if (existing) { setCurrentId(existing.id); setIsFavorite(existing.isFavorite); } 
      else { setCurrentId(uuidv4()); setIsFavorite(false); }

      const [notesRes, vizRes, tipsRes, fundRes] = await Promise.all([
        fetch(`/data/hot100/${slug}/notes.md`),
        fetch(`/data/hot100/${slug}/visualizer.html`),
        fetch(`/data/hot100/${slug}/tips.md`).catch(() => null),
        fetch(`/data/hot100/${slug}/fundamentals.md`).catch(() => null)
      ]);
      const notes = await notesRes.text();
      const viz = await vizRes.text();
      const tips = tipsRes ? await tipsRes.text() : "该题目暂无内置巧记。";
      const fund = fundRes ? await fundRes.text() : "该题目暂无基础百科记录。";
      if (info.solutions && info.solutions.length > 0) {
        const solRes = await fetch(`/data/hot100/${slug}/solutions/${info.solutions[0].file}`);
        setUserCode(await solRes.text());
      }
      setResults(prev => ({
        ...prev, explain: { content: notes, isLoading: false },
        visualize: { content: viz, isLoading: false },
        tips: { content: tips, isLoading: false },
        fundamentals: { content: fund, isLoading: false },
        complexity: { 
          content: info.solutions?.[0] 
            ? `📈 复杂度分析\n- 时间复杂度: ${info.solutions[0].time}\n- 空间复杂度: ${info.solutions[0].space}`
            : "暂无复杂度分析数据", 
          isLoading: false 
        }
      }));
      setMascotStatus('success');
      setTimeout(() => setMascotStatus('idle'), 2000);
      setActiveTab('visualize');
    } catch (err) { setMascotStatus('error'); }
  };

  const handleSyncHistory = (favOverride?: boolean) => {
    const finalFav = favOverride !== undefined ? favOverride : isFavorite;
    const item: Omit<HistoryItem, 'timestamp'> = {
      id: currentId, problemDescription, userCode, language, isFavorite: finalFav,
      results: {
        visualize: results.visualize.content, fix: results.fix.content,
        explain: results.explain.content, tips: results.tips.content,
        complexity: results.complexity.content, fundamentals: results.fundamentals.content,
        chat: results.chat.messages
      }
    };
    saveHistory(item);
    setHistory(getHistory());
  };

  const handleToggleFavorite = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    handleSyncHistory(nextState);
  };

  const runAnalysisTask = async (task: TaskType) => {
    if (task === 'chat') return;
    setResults(prev => ({ ...prev, [task]: { content: '', isLoading: true } }));
    setMascotStatus('thinking');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, problemDescription, userCode, language })
      });
      const reader = response.body?.getReader();
      let accumulatedContent = '';
      setMascotStatus('typing');
      
      let lastUpdateTime = 0;
      const THROTTLE_MS = 150; // 分析任务频率稍低，150ms 即可

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedContent += new TextDecoder().decode(value);
        
        const now = Date.now();
        if (now - lastUpdateTime > THROTTLE_MS) {
          setResults(prev => ({ ...prev, [task]: { ...prev[task], content: accumulatedContent } }));
          lastUpdateTime = now;
        }
      }
      setResults(prev => ({ ...prev, [task]: { ...prev[task], content: accumulatedContent, isLoading: false, timestamp: Date.now() } }));
      setMascotStatus('success');
      
      // 💡 优化：分析结束后自动同步到历史记录
      setTimeout(() => handleSyncHistory(), 500);
    } catch (e: any) { setMascotStatus('error'); }
  };

  const handleStartAnalysis = async () => {
    const tasks: TaskType[] = ['visualize', 'fix', 'explain', 'tips', 'fundamentals'];
    await Promise.all(tasks.map(task => runAnalysisTask(task)));
    setActiveTab('visualize');
    setTimeout(() => handleSyncHistory(), 500); 
    setShowHistory(true);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setShowDashboard(false);
    setCurrentId(item.id);
    setProblemDescription(item.problemDescription);
    setUserCode(item.userCode);
    setLanguage(item.language);
    setResults({
      visualize: { content: item.results.visualize || '', isLoading: false },
      fix: { content: item.results.fix || '', isLoading: false },
      explain: { content: item.results.explain || '', isLoading: false },
      tips: { content: item.results.tips || '', isLoading: false },
      complexity: { content: item.results.complexity || '', isLoading: false },
      fundamentals: { content: item.results.fundamentals || '', isLoading: false },
      chat: { messages: item.results.chat || [], isLoading: false }
    });
    setIsFavorite(item.isFavorite);
    setShowHistory(false);
    setActiveTab('visualize');
    const extracted = extractTitleFromMarkdown(item.results.explain || '');
    const inferred = inferTitleFromCode(item.userCode);
    setCustomTitle(extracted || inferred || '');
  };

  const handleToggleFavInHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = toggleFavorite(id);
    setHistory(newHistory);
    if (id === currentId) setIsFavorite(!isFavorite);
  };

  const handleStopChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setResults(prev => ({ ...prev, chat: { ...prev.chat, isLoading: false } }));
      setMascotStatus('idle');
    }
  };

  const handleSendMessage = async () => {
    if (!userMsgInput.trim() || results.chat.isLoading) return;
    
    // Prevent multiple simultaneous requests
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const newUserMsg: ChatMessage = { role: 'user', content: userMsgInput, timestamp: Date.now() };
    const currentHistory = results.chat.messages;
    
    setResults(prev => ({ 
      ...prev, 
      chat: { ...prev.chat, messages: [...prev.chat.messages, newUserMsg], isLoading: true } 
    }));
    setUserMsgInput('');
    setMascotStatus('thinking');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ 
          task: 'chat', 
          problemDescription, 
          userCode, 
          language, 
          userMessage: newUserMsg.content,
          chatHistory: currentHistory // Pass context
        })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      let aiResponseContent = '';
      const aiMsgId = Date.now();
      setMascotStatus('typing');

      let lastUpdateTime = 0;
      const THROTTLE_MS = 100; // 限制 100ms 更新一次 UI

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponseContent += new TextDecoder().decode(value);
        
        const now = Date.now();
        if (now - lastUpdateTime > THROTTLE_MS) {
          setResults(prev => {
            const others = prev.chat.messages.filter(m => m.timestamp !== aiMsgId);
            return { 
              ...prev, 
              chat: { 
                ...prev.chat, 
                messages: [...others, { role: 'assistant', content: aiResponseContent, timestamp: aiMsgId }] 
              } 
            };
          });
          lastUpdateTime = now;
        }
      }
      // 最后强制更新一次，确保内容完整
      setResults(prev => {
        const others = prev.chat.messages.filter(m => m.timestamp !== aiMsgId);
        return { 
          ...prev, 
          chat: { ...prev.chat, messages: [...others, { role: 'assistant', content: aiResponseContent, timestamp: aiMsgId }], isLoading: false } 
        };
      });
      setMascotStatus('success');
      abortControllerRef.current = null;
      
      // 💡 优化：聊天结束后自动同步到历史记录
      setTimeout(() => handleSyncHistory(), 500); 
    } catch (e: any) { 
      if (e.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setMascotStatus('error');
        setResults(prev => ({ ...prev, chat: { ...prev.chat, isLoading: false } }));
      }
    }
  };

  const renderTabButton = (type: TaskType | 'input', icon: React.ReactNode, label: string) => (
    <button onClick={() => setActiveTab(type)} className={clsx("relative flex items-center gap-3 px-4 py-3 w-full text-left transition-all rounded-xl group border border-transparent", activeTab === type ? "bg-white/10 text-white border-white/10" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300")}>
      <div className={clsx("transition-transform group-hover:scale-110 text-violet-400", activeTab === type && "scale-110")}>{(results as any)[type]?.isLoading ? <Loader2 className="animate-spin" size={18} /> : icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <main className="h-screen w-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans overflow-hidden">
      <nav className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">{sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}</button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleResetToHome}>
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-lg"><Sparkles size={18} className="text-white" /></div>
            <h1 className="text-lg font-bold text-white tracking-tight">LeetCode <span className="text-zinc-500 font-light">AI</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/Blessed-Z/VisualLeet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-white transition-colors"
          >
            <Github size={18} />
            <span className="text-xs font-medium hidden sm:inline">GitHub</span>
          </a>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <button onClick={handleResetToHome} className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-zinc-200 hover:text-white rounded-full border border-white/10 text-sm font-bold transition-all shadow-xl active:scale-95 group"><RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /><span>新任务 / 主页</span></button>
          {!showDashboard && <button onClick={handleStartAnalysis} className="flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg shadow-white/5"><Send size={14} /> <span>一键分析</span></button>}
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-white/5">
            <button onClick={() => { setOverlayTab('history'); setShowHistory(true); }} className={clsx("p-2 rounded-full transition-all", showHistory && overlayTab === 'history' ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300")}><History size={16} /></button>
            <button onClick={() => { setOverlayTab('favorites'); setShowHistory(true); }} className={clsx("p-2 rounded-full transition-all", showHistory && overlayTab === 'favorites' ? "bg-white/10 text-amber-400" : "text-zinc-500 hover:text-zinc-300")}><Star size={16} /></button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden border-r border-white/5 bg-zinc-950">
              <ProblemLibrary onSelect={handleSelectProblem} selectedSlug={currentProblemSlug} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex bg-black relative overflow-hidden">
          {showDashboard ? (
            <Dashboard onAction={handleDashboardAction} />
          ) : (
            <div className="flex-1 flex overflow-hidden">
              <div className="w-56 p-4 border-r border-white/5 flex flex-col gap-1.5 bg-zinc-950/30">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 px-2">录入</div>
                {renderTabButton('input', <Edit3 size={16} />, '题目与代码')}
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest my-3 px-2 pt-4 border-t border-white/5">分析工具</div>
                {renderTabButton('visualize', <Play size={16} />, '可视化演示')}
                {renderTabButton('fundamentals', <Info size={16} />, '基础百科')}
                {renderTabButton('explain', <BookOpen size={16} />, '深度解析')}
                {renderTabButton('tips', <Lightbulb size={16} />, '思路巧记')}
                {renderTabButton('fix', <Wrench size={16} />, '代码修正')}
                <div className="mt-auto pt-6 flex flex-col items-center gap-4">
                  <button onClick={() => setAssistantOpen(!assistantOpen)} className={clsx("p-3 rounded-2xl border transition-all", assistantOpen ? "bg-violet-600/20 border-violet-500/30 text-violet-400" : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300")}><MessageSquare size={20} /></button>
                  <CypherMascot status={mascotStatus} />
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                  <div className="mb-6 flex items-center justify-between shrink-0">
                     <h2 className="text-2xl font-bold text-white tracking-tight line-clamp-1 max-w-[70%]">{getProblemTitle()}</h2>
                     <div className="flex gap-2">
                       {activeTab === 'input' && <button onClick={handleStartAnalysis} className="px-4 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"><Send size={12} /> 开始分析</button>}
                       {activeTab === 'fix' && results.fix.content && <button onClick={() => { let c = results.fix.content; const m = c.match(/```(?:\w+)?\n([\s\S]*?)\n```/); setUserCode(m ? m[1] : c); setActiveTab('input'); }} className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-lg">应用并修改</button>}
                       {(activeTab !== 'input') && results[activeTab as TaskType]?.content && <button onClick={handleToggleFavorite} className={clsx("px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all active:scale-95", isFavorite ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-zinc-800 text-zinc-400 border-white/5")}><Star size={12} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "已收藏" : "收藏笔记"}</button>}
                     </div>
                  </div>
                  <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                     {activeTab === 'input' ? (
                       <div className="flex flex-col h-full p-8 gap-6 overflow-y-auto custom-scrollbar">
                         <div className="h-[20%] flex flex-col gap-3 min-h-[120px]"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">题目描述 / URL</label><textarea className="w-full h-full bg-zinc-950/50 border border-white/5 rounded-2xl p-6 text-sm text-zinc-300 outline-none resize-none focus:ring-1 focus:ring-violet-500/30" placeholder="粘贴题目内容..." value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} /></div>
                         <div className="h-[80%] flex flex-col gap-3 min-h-[400px]"><div className="flex items-center justify-between"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">代码实现</label><select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-zinc-900 border border-white/10 text-[10px] text-zinc-400 rounded px-2 py-1"><option value="python">Python</option><option value="javascript">JavaScript</option><option value="java">Java</option></select></div><div className="flex-1 border border-white/5 rounded-2xl overflow-hidden"><CodeEditor value={userCode} onChange={(val) => setUserCode(val || '')} language={language} readOnly={Object.values(results).some(r => r.isLoading)} placeholder="# 在此粘贴你的代码实现..." /></div></div>
                       </div>

                     ) : (results[activeTab as TaskType].isLoading && !results[activeTab as TaskType].content) ? (
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-6"><div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-violet-500 animate-spin" /><p className="text-sm text-zinc-500">赛芙正在思考...</p></div>
                     ) : (
                       <div className="h-full w-full overflow-hidden flex flex-col">{activeTab === 'visualize' && <Visualizer htmlContent={results.visualize.content} />}{activeTab === 'fix' && <CodeEditor value={results.fix.content} onChange={() => {}} language={language} readOnly={true} />}{(activeTab === 'explain' || activeTab === 'tips' || activeTab === 'fundamentals') && <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-zinc-950/20"><MarkdownRenderer content={results[activeTab as TaskType].content} /></div>}</div>
                     )}
                  </div>
                </div>

                <AnimatePresence>
                  {assistantOpen && (
                    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 350, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex flex-col border-l border-white/5 bg-zinc-950/50 backdrop-blur-3xl shrink-0">
                      <div className="p-4 border-b border-white/5 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={16} className="text-violet-400" /> 助手伴读</div><button onClick={() => setAssistantOpen(false)} className="text-zinc-600 hover:text-white p-1"><PanelRightClose size={18} /></button></div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {results.chat.messages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-violet-600/10 flex items-center justify-center text-violet-400">
                              <Sparkles size={32} />
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-zinc-200">嘿！我是你的算法小助手</p>
                              <p className="text-xs leading-relaxed text-zinc-500">
                                现在的在线演示版由于没有魔法钥匙（API Key），我还没法陪你实时聊天。
                                <br/><br/>
                                快去 <a href="https://github.com/Blessed-Z/VisualLeet" target="_blank" className="text-violet-400 underline underline-offset-4">GitHub 仓库</a> 把项目搬回家吧！只要配上你自己的钥匙，我就能陪你写出超棒的代码啦！✨
                              </p>
                            </div>
                          </div>
                        )}
                        {results.chat.messages.map((msg, i) => (
                          <div key={i} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                            <div className={clsx(
                              "p-4 rounded-2xl text-sm leading-relaxed shadow-lg max-w-[90%] break-words",
                              msg.role === 'user' 
                                ? "bg-violet-600 text-white rounded-tr-none" 
                                : "bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-none"
                            )}>
                              {msg.role === 'assistant' 
                                ? <MarkdownRenderer content={msg.content} variant="chat" /> 
                                : msg.content
                              }
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-4 border-t border-white/5">
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50" 
                            placeholder={results.chat.isLoading ? "赛芙正在回复..." : "在此提问..."} 
                            value={userMsgInput} 
                            onChange={(e) => setUserMsgInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={results.chat.isLoading}
                          />
                          {results.chat.isLoading ? (
                            <button onClick={handleStopChat} className="absolute right-2.5 text-zinc-400 hover:text-white transition-colors">
                              <Square size={14} fill="currentColor" />
                            </button>
                          ) : (
                            <button onClick={handleSendMessage} className="absolute right-2.5 text-violet-400 hover:text-violet-300 transition-colors">
                              <Send size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!assistantOpen && <button onClick={() => setAssistantOpen(true)} className="absolute right-4 bottom-4 p-3 bg-violet-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-20"><MessageSquare size={20} /></button>}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="relative w-full max-w-md bg-[#09090b] h-full shadow-2xl border-l border-white/10 flex flex-col">
              <div className="p-5 border-b border-white/5 flex items-center justify-between"><div className="flex gap-4"><button onClick={() => setOverlayTab('history')} className={clsx("text-lg font-bold flex items-center gap-2", overlayTab === 'history' ? "text-white" : "text-zinc-600")}><History size={18} /> 历史记录</button><button onClick={() => setOverlayTab('favorites')} className={clsx("text-lg font-bold flex items-center gap-2", overlayTab === 'favorites' ? "text-amber-400" : "text-zinc-600")}><Star size={18} /> 收藏笔记</button></div><button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white p-2 bg-white/5 rounded-full"><X size={20} /></button></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.filter(h => overlayTab === 'favorites' ? h.isFavorite : true).map((item) => {
                  const displayTitle = extractTitleFromMarkdown(item.results.explain || '') || inferTitleFromCode(item.userCode) || item.problemDescription.substring(0, 80).replace(/\n/g, ' ') || "未命名题目";
                  return (
                    <div key={item.id} onClick={() => handleLoadHistory(item)} className={clsx("group p-4 rounded-2xl border cursor-pointer transition-all", currentId === item.id ? "border-violet-500/30 bg-violet-500/5" : "border-white/5 bg-white/5 hover:border-white/10")}>
                      <div className="flex justify-between items-start mb-2"><h3 className="font-medium text-sm text-zinc-200 line-clamp-2 leading-relaxed break-all">{displayTitle}</h3><button onClick={(e) => handleToggleFavInHistory(e, item.id)} className={clsx("shrink-0 p-1 rounded-md transition-colors", item.isFavorite ? "text-amber-500 bg-amber-500/10" : "text-zinc-700 hover:text-zinc-400")}><Star size={14} fill={item.isFavorite ? "currentColor" : "none"} /></button></div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-600 mt-4"><span className="flex items-center gap-1 font-mono tracking-tighter uppercase"><Layout size={10} /> {item.language}</span><div className="flex items-center gap-3"><span>{new Date(item.timestamp).toLocaleString()}</span><button onClick={(e) => { e.stopPropagation(); setHistory(deleteHistoryItem(item.id)); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"><Trash2 size={14} /></button></div></div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
