"use client";

import { useState, useEffect, useRef } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Visualizer } from '@/components/Visualizer';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CypherMascot, MascotStatus } from '@/components/CypherMascot';
import { 
  Play, BookOpen, Wrench, Loader2, Code2, 
  Lightbulb, Star, History, Trash2, X, Send,
  Layout, Sparkles, MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { getHistory, saveHistory, toggleFavorite, deleteHistoryItem } from '@/lib/storage';
import { HistoryItem, TaskResult, AnalysisState, TaskType, ChatMessage } from '@/types';

const initialTaskState: TaskResult = { content: '', isLoading: false };

export default function Home() {
  // --- State ---
  const [problemDescription, setProblemDescription] = useState('');
  const [userCode, setUserCode] = useState('# 在此粘贴你的代码...');
  const [language, setLanguage] = useState('python');
  const [userMsgInput, setUserMsgInput] = useState('');
  const [mascotStatus, setMascotStatus] = useState<MascotStatus>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<AnalysisState>({
    visualize: { ...initialTaskState },
    fix: { ...initialTaskState },
    explain: { ...initialTaskState },
    tips: { ...initialTaskState },
    complexity: { ...initialTaskState },
    chat: { messages: [], isLoading: false }
  });

  const [activeTab, setActiveTab] = useState<TaskType>('visualize');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentId, setCurrentId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results.chat.messages]);

  useEffect(() => {
    setHistory(getHistory());
    if (!currentId) setCurrentId(uuidv4());
  }, []);

  // --- Core Logic: Streaming Support ---

  const runAnalysisTask = async (task: TaskType) => {
    if (task === 'chat') return;

    setResults(prev => ({
      ...prev,
      [task]: { content: '', isLoading: true, error: undefined }
    }));
    setMascotStatus('thinking');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, problemDescription, userCode, language })
      });

      if (!response.ok) throw new Error('请求失败');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      let accumulatedContent = '';
      setMascotStatus('typing');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;
        
        setResults(prev => ({
          ...prev,
          [task]: { ...prev[task], content: accumulatedContent }
        }));
      }

      setResults(prev => ({
        ...prev,
        [task]: { ...prev[task], isLoading: false, timestamp: Date.now() }
      }));
      setMascotStatus('success');
      setTimeout(() => setMascotStatus('idle'), 3000);

    } catch (e: any) {
      setResults(prev => ({
        ...prev,
        [task]: { ...prev[task], isLoading: false, error: e.message }
      }));
      setMascotStatus('error');
    }
  };

  const handleSendMessage = async () => {
    if (!userMsgInput.trim()) return;

    const newUserMsg: ChatMessage = {
      role: 'user',
      content: userMsgInput,
      timestamp: Date.now()
    };

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
        body: JSON.stringify({
          task: 'chat',
          problemDescription,
          userCode,
          language,
          userMessage: newUserMsg.content
        })
      });

      if (!response.ok) throw new Error('请求失败');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取流');

      let aiResponseContent = '';
      setMascotStatus('typing');

      // Create a temporary AI message that we will update
      const aiMsgId = Date.now();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiResponseContent += chunk;

        setResults(prev => {
          const otherMessages = prev.chat.messages.filter(m => m.timestamp !== aiMsgId);
          return {
            ...prev,
            chat: {
              ...prev.chat,
              messages: [
                ...otherMessages,
                { role: 'assistant', content: aiResponseContent, timestamp: aiMsgId }
              ]
            }
          };
        });
      }

      setResults(prev => ({
        ...prev,
        chat: { ...prev.chat, isLoading: false }
      }));
      setMascotStatus('success');
      setTimeout(() => setMascotStatus('idle'), 3000);

    } catch (e: any) {
      setResults(prev => ({
        ...prev,
        chat: { ...prev.chat, isLoading: false, error: e.message }
      }));
      setMascotStatus('error');
    }
  };

  const handleApplyFix = () => {
    if (results.fix.content) {
      // 提取代码部分（如果 AI 返回了 markdown 格式）
      let code = results.fix.content;
      const match = code.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
      if (match) code = match[1];
      setUserCode(code);
      alert("代码已应用！");
    }
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("复制成功！");
  };

  const handleSaveAsNote = () => {
    const item: Omit<HistoryItem, 'timestamp'> = {
      id: currentId,
      problemDescription,
      userCode,
      language,
      isFavorite: true,
      results: { 
        visualize: results.visualize.content,
        fix: results.fix.content,
        explain: results.explain.content,
        tips: results.tips.content,
        complexity: results.complexity.content,
        chat: results.chat.messages
      }
    };
    saveHistory(item);
    setHistory(getHistory());
    setIsFavorite(true);
    alert("已保存到「我的笔记」！");
  };

  const handleLoadHistory = (item: HistoryItem) => {
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
      chat: { messages: item.results.chat || [], isLoading: false }
    });
    setIsFavorite(item.isFavorite);
    setShowHistory(false);
  };

  const handleToggleFavorite = () => {
    const newHistory = toggleFavorite(currentId);
    setHistory(newHistory);
    const currentItem = newHistory.find(h => h.id === currentId);
    if (currentItem) setIsFavorite(currentItem.isFavorite);
  };
  
  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = deleteHistoryItem(id);
    setHistory(newHistory);
    if (currentId === id) {
       setCurrentId(uuidv4());
       setResults({
         visualize: { ...initialTaskState },
         fix: { ...initialTaskState },
         explain: { ...initialTaskState },
         tips: { ...initialTaskState },
         complexity: { ...initialTaskState },
         chat: { messages: [], isLoading: false }
       });
       setIsFavorite(false);
    }
  };

  const handleStartAnalysis = () => {
    const tasks: TaskType[] = ['visualize', 'fix', 'explain', 'tips'];
    tasks.forEach(task => runAnalysisTask(task));
  };

  const renderTabButton = (type: TaskType, icon: React.ReactNode, label: string) => {
    const result = (results as any)[type];
    const isActive = activeTab === type;
    const isLoading = type === 'chat' ? results.chat.isLoading : result.isLoading;
    const hasContent = type === 'chat' ? results.chat.messages.length > 0 : result.content;
    
    return (
      <button
        onClick={() => setActiveTab(type)}
        className={clsx(
          "relative flex items-center gap-3 px-4 py-3 w-full text-left transition-all rounded-xl group border border-transparent",
          isActive 
            ? "bg-white/10 text-white border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        )}
      >
        <div className={clsx("transition-transform group-hover:scale-110 text-violet-400", isActive && "scale-110")}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
        {!isLoading && hasContent && (
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}
      </button>
    );
  };

  return (
    <main className="h-screen w-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans overflow-hidden">
      {/* 1. Navbar */}
      <nav className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-lg shadow-lg shadow-violet-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
            LeetCode AI <span className="font-light text-zinc-500">Workspace</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={handleStartAnalysis} className="group flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-zinc-200 rounded-full font-semibold text-sm transition-all active:scale-95">
            <Send size={14} />
            <span>一键分析</span>
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button onClick={handleToggleFavorite} className={clsx("p-2 rounded-full border border-transparent", isFavorite ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300")}>
            <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setShowHistory(true)} className="p-2 text-zinc-500 hover:bg-white/5 rounded-full relative">
            <History size={18} />
            {history.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />}
          </button>
        </div>
      </nav>

      {/* 2. Workspace */}
      <div className="flex-1 flex overflow-hidden bg-black">
        {/* Left: Input */}
        <div className="w-[30%] flex flex-col border-r border-white/5 bg-zinc-950 min-w-[350px]">
          <div className="h-1/3 p-4 flex flex-col gap-2 min-h-[150px]">
             <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 px-1">
               <BookOpen size={12} /> 题目 / 链接
             </label>
             <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-xl p-1 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
               <textarea className="w-full h-full bg-transparent border-none p-3 text-sm text-zinc-300 outline-none resize-none placeholder:text-zinc-700" placeholder="在此粘贴题目描述 或 URL..." value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} />
             </div>
          </div>
          <div className="flex-1 p-4 pt-0 flex flex-col gap-2 overflow-hidden">
             <div className="flex items-center justify-between shrink-0 px-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Code2 size={12} /> 代码输入</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-zinc-900 border border-white/10 text-[10px] text-zinc-400 rounded px-2 py-1 outline-none">
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
             </div>
             <div className="flex-1 rounded-xl overflow-hidden border border-white/5 bg-[#1e1e1e] shadow-2xl relative">
               <CodeEditor value={userCode} onChange={(val) => setUserCode(val || '')} language={language} />
             </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="flex-1 flex bg-[#050505] relative">
          <div className="w-64 p-4 border-r border-white/5 flex flex-col gap-2 bg-zinc-950/50 relative">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 px-2">分析工具</div>
            {renderTabButton('visualize', <Play size={16} />, '可视化演示')}
            {renderTabButton('fix', <Wrench size={16} />, '代码修正')}
            {renderTabButton('explain', <BookOpen size={16} />, '逻辑讲解')}
            {renderTabButton('tips', <Lightbulb size={16} />, '思路巧记')}
            <div className="mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 px-2 border-t border-white/5 pt-4">交互问答</div>
            {renderTabButton('chat', <MessageSquare size={16} />, 'AI 导师')}
            
            {/* 赛芙 Mascot 放置在侧边栏底部 */}
            <div className="mt-auto pt-10 pb-4 flex justify-center">
              <CypherMascot status={mascotStatus} />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden flex flex-col relative">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 h-full flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                 <div className="flex flex-col">
                   <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                     {activeTab === 'chat' ? 'AI 导师对话' : activeTab === 'visualize' ? '可视化演示' : activeTab === 'fix' ? '代码修正' : activeTab === 'explain' ? '深度解析' : '思路笔记'}
                   </h2>
                 </div>
                 <div className="flex items-center gap-3">
                   {activeTab === 'fix' && results.fix.content && <button onClick={() => handleCopyCode(results.fix.content)} className="px-3 py-1.5 bg-zinc-800/50 text-xs rounded-lg border border-white/5">复制</button>}
                   {activeTab === 'fix' && results.fix.content && <button onClick={handleApplyFix} className="px-3 py-1.5 bg-violet-600/20 text-violet-300 text-xs rounded-lg border border-violet-500/30">应用修复</button>}
                   {(activeTab === 'explain' || activeTab === 'tips') && results[activeTab].content && <button onClick={handleSaveAsNote} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg shadow-lg">存为笔记</button>}
                 </div>
              </div>

              <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
                 {activeTab === 'chat' ? (
                   <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {results.chat.messages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                            <MessageSquare size={48} strokeWidth={1} opacity={0.3} />
                            <p className="text-sm">对这道题的代码或逻辑有疑问？随便问我。</p>
                          </div>
                        )}
                        {results.chat.messages.map((msg, i) => (
                          <div key={i} className={clsx("flex flex-col max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
                            <div className={clsx("p-4 rounded-2xl text-sm leading-relaxed shadow-lg", msg.role === 'user' ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-200 border border-white/5")}>
                              {msg.role === 'assistant' ? <MarkdownRenderer content={msg.content} /> : msg.content}
                            </div>
                          </div>
                        ))}
                        {results.chat.isLoading && results.chat.messages.filter(m => m.role === 'assistant').length === 0 && (
                          <div className="flex items-center gap-2 text-violet-400 text-xs animate-pulse">
                            <Loader2 size={12} className="animate-spin" /> 赛芙正在思考...
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-4 border-t border-white/5 bg-black/20">
                        <div className="relative flex items-center">
                          <input type="text" className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500 outline-none" placeholder="输入问题..." value={userMsgInput} onChange={(e) => setUserMsgInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                          <button onClick={handleSendMessage} disabled={results.chat.isLoading} className="absolute right-2 p-2 text-violet-400 hover:text-violet-300 disabled:opacity-50"><Send size={18} /></button>
                        </div>
                      </div>
                   </div>
                 ) : (results[activeTab].isLoading && !results[activeTab].content) ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                     <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-violet-500 animate-spin" />
                     <p className="text-sm text-zinc-500 animate-pulse">赛芙正在努力分析...</p>
                   </div>
                 ) : !results[activeTab].content ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 gap-4">
                     <Layout size={48} strokeWidth={1} opacity={0.2} />
                     <p className="text-sm text-zinc-500">点击 "一键分析" 开始</p>
                   </div>
                 ) : (
                   <div className="h-full w-full overflow-hidden flex flex-col">
                      {activeTab === 'visualize' && <Visualizer htmlContent={results.visualize.content} />}
                      {activeTab === 'fix' && <CodeEditor value={results.fix.content} onChange={() => {}} language={language} />}
                      {(activeTab === 'explain' || activeTab === 'tips') && <MarkdownRenderer content={results[activeTab].content} />}
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md bg-[#09090b] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold text-lg text-white flex items-center gap-2"><History size={18} className="text-violet-500" /> 历史记录</h2>
              <button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? <div className="text-center text-zinc-600 py-20 text-sm">暂无记录</div> : history.map((item) => (
                <div key={item.id} onClick={() => handleLoadHistory(item)} className={clsx("group p-4 rounded-xl border cursor-pointer transition-all", currentId === item.id ? "border-violet-500/30 bg-violet-500/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]" : "border-white/5 bg-white/5 hover:border-white/10")}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm text-zinc-200 line-clamp-1">{item.problemDescription.substring(0, 50) || "无标题"}</h3>
                    {item.isFavorite && <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20"><Star size={10} fill="currentColor" /> 笔记</span>}
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <button onClick={(e) => handleDeleteHistory(e, item.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
