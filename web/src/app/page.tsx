"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

// 🚀 动态导入优化
const CodeEditor = dynamic(() => import('@/components/CodeEditor').then(mod => mod.CodeEditor), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900/50 animate-pulse flex items-center justify-center text-zinc-700 text-xs">载入编辑器...</div>
});

const Visualizer = dynamic(() => import('@/components/Visualizer'), { ssr: false });
const MarkdownRenderer = dynamic(() => import('@/components/MarkdownRenderer'), { ssr: false });
const ProblemLibrary = dynamic(() => import('@/components/ProblemLibrary'), { ssr: false });
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

import { CypherMascot, MascotStatus } from '@/components/CypherMascot';
import { 
  Play, BookOpen, Wrench, Loader2, 
  Lightbulb, Star, History, Trash2, X, Send, Square,
  Layout, Sparkles, MessageSquare, PanelLeftClose, PanelLeftOpen, Info, Edit3, RefreshCw, Github
} from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { getHistory, saveHistory, toggleFavorite, deleteHistoryItem } from '@/lib/storage';
import { HistoryItem, TaskResult, AnalysisState, TaskType, ChatMessage } from '@/types';
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile first: start closed
  const [assistantOpen, setAssistantOpen] = useState(false);
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
    
    // Auto-open sidebar on desktop
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // --- Helpers ---
  const extractTitleFromMarkdown = (md: string) => {
    const match = md.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : '';
  };

  const inferTitleFromCode = (code: string) => {
    const matches = Array.from(code.matchAll(/(?:def|function|class)\s+([a-zA-Z0-9_]+)/g))
      .map(m => m[1])
      .filter(name => !['__init__', 'ListNode', 'Node', 'Solution', 'self', 'main'].includes(name));
    const name = matches[0];
    if (!name) return '';
    return name.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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

  const handleSyncHistory = () => {
    const resultsData = {
      fix: results.fix.content,
      explain: results.explain.content,
      visualize: results.visualize.content,
      tips: results.tips.content,
      complexity: results.complexity.content,
      fundamentals: results.fundamentals.content,
      chat: results.chat.messages
    };
    const newHistory = saveHistory({ id: currentId, problemDescription, userCode, language, results: resultsData, isFavorite });
    setHistory(newHistory);
  };

  const handleSelectProblem = async (slug: string) => {
    setShowDashboard(false);
    setCurrentProblemSlug(slug);
    setCurrentId(uuidv4());
    setIsFavorite(false);
    setCustomTitle('');
    setResults({
      visualize: { ...initialTaskState, isLoading: true },
      fix: { ...initialTaskState, isLoading: true },
      explain: { ...initialTaskState, isLoading: true },
      tips: { ...initialTaskState, isLoading: true },
      complexity: { ...initialTaskState, isLoading: true },
      fundamentals: { ...initialTaskState, isLoading: true },
      chat: { messages: [], isLoading: false }
    });
    setActiveTab('visualize');

    try {
      const response = await fetch(`/data/hot100/${slug}/info.json`);
      const info = await response.json();
      setProblemDescription(info.description || '');
      const solutionsRes = await fetch(`/data/hot100/${slug}/solutions/python3.py`);
      const code = await solutionsRes.text();
      setUserCode(code);
      const fetchTask = async (task: TaskType, path: string) => {
        try {
          const res = await fetch(`/data/hot100/${slug}/${path}`);
          const content = await res.text();
          setResults(prev => ({ ...prev, [task]: { content, isLoading: false } }));
        } catch (e) {
          setResults(prev => ({ ...prev, [task]: { content: '', isLoading: false, error: '加载失败' } }));
        }
      };
      fetchTask('visualize', 'visualizer.html');
      fetchTask('explain', 'notes.md');
      fetchTask('tips', 'tips.md');
      fetchTask('fundamentals', 'fundamentals.md');
      setResults(prev => ({ ...prev, fix: { content: code, isLoading: false }, complexity: { content: '时间复杂度: ' + (info.complexity?.time || 'O(N)') + '\n空间复杂度: ' + (info.complexity?.space || 'O(N)'), isLoading: false } }));
      setTimeout(() => handleSyncHistory(), 1000);
    } catch (err) {
      console.error("Failed to load problem data:", err);
    }
  };

  const handleDashboardAction = (action: 'analyze' | 'fix' | 'favorites') => {
    setShowDashboard(false);
    setCurrentId(uuidv4());
    if (action === 'favorites') {
      setOverlayTab('favorites');
      setShowHistory(true);
    } else {
      setActiveTab('input');
    }
  };

  const handleResetToHome = () => {
    setShowDashboard(true);
    setCurrentProblemSlug(undefined);
    setProblemDescription('');
    setUserCode('');
    setResults({
      visualize: { ...initialTaskState },
      fix: { ...initialTaskState },
      explain: { ...initialTaskState },
      tips: { ...initialTaskState },
      complexity: { ...initialTaskState },
      fundamentals: { ...initialTaskState },
      chat: { messages: [], isLoading: false }
    });
  };

  const runAnalysisTask = async (task: TaskType) => {
    if (!problemDescription.trim()) return;
    setResults(prev => ({ ...prev, [task]: { ...prev[task], isLoading: true, content: '' } }));
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, problemDescription, userCode, language })
      });
      const reader = response.body?.getReader();
      if (!reader) { setMascotStatus('error'); return; }
      const activeReader = reader;
      let accumulatedContent = '';
      setMascotStatus('typing');
      let lastUpdateTime = 0;
      const THROTTLE_MS = 200; 
      while (true) {
        const { done, value } = await activeReader.read();
        if (done) break;
        if (value) { accumulatedContent += new TextDecoder().decode(value); }
        const now = Date.now();
        if (now - lastUpdateTime > THROTTLE_MS) {
          setResults(prev => ({ ...prev, [task]: { ...prev[task], content: accumulatedContent } }));
          lastUpdateTime = now;
        }
      }
      setResults(prev => ({ ...prev, [task]: { ...prev[task], content: accumulatedContent, isLoading: false, timestamp: Date.now() } }));
      setMascotStatus('success');
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

  const handleToggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    setTimeout(() => handleSyncHistory(), 100);
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
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const newUserMsg: ChatMessage = { role: 'user', content: userMsgInput, timestamp: Date.now() };
    const currentHistory = results.chat.messages;
    setResults(prev => ({ ...prev, chat: { ...prev.chat, messages: [...prev.chat.messages, newUserMsg], isLoading: true } }));
    setUserMsgInput('');
    setMascotStatus('thinking');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ task: 'chat', problemDescription, userCode, language, userMessage: newUserMsg.content, chatHistory: currentHistory })
      });
      const reader = response.body?.getReader();
      if (!reader) { setMascotStatus('error'); return; }
      const activeReader = reader;
      let aiResponseContent = '';
      const aiMsgId = Date.now();
      setMascotStatus('typing');
      let lastUpdateTime = 0;
      const THROTTLE_MS = 100;
      while (true) {
        const { done, value } = await activeReader.read();
        if (done) break;
        if (value) { aiResponseContent += new TextDecoder().decode(value); }
        const now = Date.now();
        if (now - lastUpdateTime > THROTTLE_MS) {
          setResults(prev => {
            const others = prev.chat.messages.filter(m => m.timestamp !== aiMsgId);
            return { ...prev, chat: { ...prev.chat, messages: [...others, { role: 'assistant', content: aiResponseContent, timestamp: aiMsgId }] } };
          });
          lastUpdateTime = now;
        }
      }
      setResults(prev => {
        const others = prev.chat.messages.filter(m => m.timestamp !== aiMsgId);
        return { ...prev, chat: { ...prev.chat, messages: [...others, { role: 'assistant', content: aiResponseContent, timestamp: aiMsgId }], isLoading: false } };
      });
      setMascotStatus('success');
      setTimeout(() => handleSyncHistory(), 500);
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      setMascotStatus('error');
      setResults(prev => ({ ...prev, chat: { ...prev.chat, isLoading: false } }));
    }
  };

  const renderTabButton = (type: TaskType | 'input', icon: React.ReactNode, label: string) => {
    const isLoading = type !== 'input' && type !== 'chat' ? (results[type as keyof Omit<AnalysisState, 'chat'>] as TaskResult)?.isLoading : false;
    return (
      <button 
        onClick={() => setActiveTab(type)} 
        className={clsx(
          "relative flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 min-w-fit md:w-full text-left transition-all rounded-xl group border border-transparent shrink-0", 
          activeTab === type ? "bg-white/10 text-white border-white/10 shadow-lg" : "text-zinc-500 hover:bg-white/5"
        )}
      >
        <div className={clsx("transition-transform group-hover:scale-110 text-violet-400", activeTab === type && "scale-110")}>
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : icon}
        </div>
        <span className="font-medium text-xs md:text-sm whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <main className="h-screen w-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 md:gap-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={handleResetToHome}>
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 md:p-2 rounded-lg"><Sparkles size={16} className="text-white" /></div>
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight">VisualLeet <span className="hidden xs:inline text-zinc-500 font-light">.ai</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <a href="https://github.com/Blessed-Z/VisualLeet" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <div className="h-6 w-px bg-white/10 mx-0.5 md:mx-1" />
          <button onClick={handleResetToHome} className="p-2 md:px-4 md:py-2 bg-zinc-900 text-zinc-200 hover:text-white rounded-full border border-white/10 transition-all active:scale-95 shadow-xl">
            <RefreshCw size={16} className="md:hidden" />
            <span className="hidden md:inline text-sm font-bold">主页</span>
          </button>
          <button onClick={() => { setOverlayTab('history'); setShowHistory(true); }} className="p-2 text-zinc-500 hover:text-white transition-all">
            <History size={20} />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar with Mobile Drawer Logic */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div 
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                className="absolute inset-y-0 left-0 z-50 w-72 lg:relative lg:z-0 overflow-hidden border-r border-white/5 bg-zinc-950 flex flex-col shadow-2xl lg:shadow-none"
              >
                <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-400">题目列表</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 bg-white/5 rounded-lg"><X size={18}/></button>
                </div>
                <ProblemLibrary onSelect={(slug) => { handleSelectProblem(slug); if (window.innerWidth < 1024) setSidebarOpen(false); }} selectedSlug={currentProblemSlug} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex bg-black relative overflow-hidden">
          {showDashboard ? (
            <Dashboard onAction={handleDashboardAction} />
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Task Tabs: Top bar on Mobile, Side bar on Desktop */}
              <div className="w-full lg:w-56 p-2 lg:p-4 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-row lg:flex-col gap-1.5 bg-zinc-950/30 overflow-x-auto no-scrollbar shrink-0 z-10">
                {renderTabButton('input', <Edit3 size={16} />, '录入')}
                <div className="hidden lg:block h-px bg-white/5 my-2 mx-2" />
                {renderTabButton('visualize', <Play size={16} />, '演示')}
                {renderTabButton('fundamentals', <Info size={16} />, '百科')}
                {renderTabButton('explain', <BookOpen size={16} />, '解析')}
                {renderTabButton('tips', <Lightbulb size={16} />, '巧记')}
                {renderTabButton('fix', <Wrench size={16} />, '修正')}
                
                <div className="hidden lg:flex mt-auto pt-6 flex-col items-center gap-4">
                  <button onClick={() => setAssistantOpen(!assistantOpen)} className={clsx("p-3 rounded-2xl border transition-all", assistantOpen ? "bg-violet-600/20 border-violet-500/30 text-violet-400" : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300")}><MessageSquare size={20} /></button>
                  <CypherMascot status={mascotStatus} />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 p-3 md:p-6 overflow-hidden flex flex-col">
                  <div className="mb-4 md:mb-6 flex items-center justify-between shrink-0">
                     <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight line-clamp-1 max-w-[60%]">{getProblemTitle()}</h2>
                     <div className="flex gap-2">
                       {activeTab === 'input' && <button onClick={handleStartAnalysis} className="px-3 py-1.5 bg-violet-600 text-white text-[10px] md:text-xs font-bold rounded-lg flex items-center gap-1.5"><Send size={12} /> 分析</button>}
                       {activeTab !== 'input' && activeTab !== 'chat' && (results[activeTab] as TaskResult)?.content && <button onClick={handleToggleFavorite} className={clsx("px-3 py-1.5 rounded-lg border text-[10px] md:text-xs flex items-center gap-1.5", isFavorite ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-zinc-800 text-zinc-400 border-white/5")}><Star size={12} fill={isFavorite ? "currentColor" : "none"} /> <span className="hidden xs:inline">{isFavorite ? "已收藏" : "收藏"}</span></button>}
                     </div>
                  </div>
                  <div className="flex-1 bg-zinc-900/40 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col relative">
                     {activeTab === 'input' ? (
                       <div className="flex flex-col h-full p-4 md:p-8 gap-4 md:gap-6 overflow-y-auto custom-scrollbar">
                         <div className="flex-1 flex flex-col gap-2 min-h-[120px]"><label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">题目详情</label><textarea className="w-full h-full bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 outline-none resize-none focus:ring-1 focus:ring-violet-500/30" placeholder="粘贴题目描述或链接..." value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} /></div>
                         <div className="flex-[2] flex flex-col gap-2 min-h-[250px]"><div className="flex items-center justify-between"><label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">代码实现</label><select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-zinc-900 border border-white/10 text-[10px] text-zinc-400 rounded px-2 py-1"><option value="python">Python</option><option value="javascript">JavaScript</option></select></div><div className="flex-1 border border-white/5 rounded-xl overflow-hidden"><CodeEditor value={userCode} onChange={(val) => setUserCode(val || '')} language={language} readOnly={Object.values(results).some(r => 'isLoading' in r && r.isLoading)} /></div></div>
                       </div>
                     ) : (activeTab !== 'chat' && (results[activeTab] as TaskResult).isLoading && !(results[activeTab] as TaskResult).content) ? (
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"><div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-violet-500 animate-spin" /><p className="text-xs text-zinc-500">赛芙分析中...</p></div>
                     ) : (
                       <div className="h-full w-full overflow-hidden flex flex-col">
                         {activeTab === 'visualize' && <Visualizer htmlContent={results.visualize.content} />}
                         {activeTab === 'fix' && <CodeEditor value={results.fix.content} onChange={() => {}} language={language} readOnly={true} />}
                         {(activeTab === 'explain' || activeTab === 'tips' || activeTab === 'fundamentals') && (
                           <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-zinc-950/20">
                             <MarkdownRenderer content={(results[activeTab] as TaskResult).content} />
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                </div>

                {/* Assistant with Mobile Fullscreen Logic */}
                <AnimatePresence>
                  {assistantOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} 
                      className="absolute inset-0 lg:relative lg:inset-auto lg:w-[350px] z-50 flex flex-col border-l border-white/5 bg-zinc-950/95 lg:bg-zinc-950/50 backdrop-blur-3xl shrink-0"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={16} className="text-violet-400" /> 助手伴读</div><button onClick={() => setAssistantOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={18} /></button></div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {results.chat.messages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-violet-600/10 flex items-center justify-center text-violet-400"><Sparkles size={32} /></div>
                            <p className="text-xs leading-relaxed text-zinc-500">现在的在线版没有 API 钥匙，快去 GitHub 把我搬回家吧！✨</p>
                          </div>
                        )}
                        {results.chat.messages.map((msg, i) => (
                          <div key={i} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                            <div className={clsx("p-4 rounded-2xl text-sm leading-relaxed shadow-lg max-w-[90%] break-words", msg.role === 'user' ? "bg-violet-600 text-white rounded-tr-none" : "bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-none")}>
                              {msg.role === 'assistant' ? <MarkdownRenderer content={msg.content} variant="chat" /> : msg.content}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-4 border-t border-white/5 bg-zinc-950/50">
                        <div className="relative flex items-center">
                          <input type="text" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs outline-none focus:ring-1 focus:ring-violet-500" placeholder="提问..." value={userMsgInput} onChange={(e) => setUserMsgInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                          <button onClick={handleSendMessage} className="absolute right-2.5 text-violet-400"><Send size={16} /></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!assistantOpen && <button onClick={() => setAssistantOpen(true)} className="fixed lg:absolute right-4 bottom-4 p-4 bg-violet-600 text-white rounded-full shadow-2xl z-30"><MessageSquare size={20} /></button>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History/Favorites Overlay */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="relative w-full max-w-md bg-[#09090b] h-full shadow-2xl border-l border-white/10 flex flex-col">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <button onClick={() => setOverlayTab('history')} className={clsx("text-lg font-bold", overlayTab === 'history' ? "text-white" : "text-zinc-600")}>历史</button>
                  <button onClick={() => setOverlayTab('favorites')} className={clsx("text-lg font-bold", overlayTab === 'favorites' ? "text-amber-400" : "text-zinc-600")}>收藏</button>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.filter(h => overlayTab === 'favorites' ? h.isFavorite : true).map((item) => (
                  <div key={item.id} onClick={() => handleLoadHistory(item)} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 cursor-pointer">
                    <h3 className="font-medium text-sm text-zinc-200 line-clamp-2 leading-relaxed mb-3">{extractTitleFromMarkdown(item.results.explain || '') || item.problemDescription.substring(0, 50)}</h3>
                    <div className="flex justify-between items-center text-[10px] text-zinc-600"><span className="uppercase tracking-tighter font-mono">{item.language}</span><span>{new Date(item.timestamp).toLocaleDateString()}</span></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
