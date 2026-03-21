"use client";
import React, { memo } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export const CodeEditor = memo(function CodeEditor({ value, onChange, language = 'python', readOnly = false, placeholder = '' }: CodeEditorProps) {
  return (
    <div className="h-full w-full border border-zinc-800 rounded-md overflow-hidden shadow-sm relative bg-[#1e1e1e]">
      {placeholder && !value && (
        <div className="absolute top-4 left-12 z-10 pointer-events-none text-zinc-600 font-mono text-sm italic">
          {placeholder}
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        loading={<div className="h-full w-full flex items-center justify-center text-zinc-700 text-xs animate-pulse font-mono">加载编辑器核心...</div>}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          readOnly: readOnly,
          domReadOnly: readOnly,
          quickSuggestions: !readOnly,
          contextmenu: !readOnly,
          lineNumbers: 'on',
          folding: true,
          fontFamily: 'var(--font-mono)',
        }}
      />
    </div>
  );
});
