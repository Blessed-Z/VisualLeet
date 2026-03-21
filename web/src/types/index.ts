export type TaskType = 'fix' | 'explain' | 'visualize' | 'tips' | 'complexity' | 'chat' | 'fundamentals';

export interface AnalyzeRequest {
  task: TaskType;
  problemDescription: string;
  userCode: string;
  language: string;
  // For chat
  chatHistory?: ChatMessage[];
  userMessage?: string;
}

export interface AnalyzeResponse {
  result: {
    fixedCode?: string;
    explanation?: string;
    visualizationHtml?: string;
    tips?: string;
    complexity?: string;
    fundamentals?: string;
    chatReply?: string;
  };
  error?: string;
}

export interface TaskResult {
  content: string;
  isLoading: boolean;
  error?: string;
  timestamp?: number; // Used for caching check
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisState {
  fix: TaskResult;
  explain: TaskResult;
  visualize: TaskResult;
  tips: TaskResult;
  complexity: TaskResult;
  fundamentals: TaskResult;
  chat: {
    messages: ChatMessage[];
    isLoading: boolean;
    error?: string;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  problemDescription: string;
  userCode: string;
  language: string;
  isFavorite: boolean;
  results: {
    fix?: string;
    explain?: string;
    visualize?: string;
    tips?: string;
    complexity?: string;
    fundamentals?: string;
    chat?: ChatMessage[];
  };
}
