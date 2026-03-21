"use client";
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, language = 'python', readOnly = false, placeholder = '' }: CodeEditorProps) {
  return (
    <div className="h-full w-full border border-gray-700 rounded-md overflow-hidden shadow-sm relative">
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
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          readOnly: readOnly,
          domReadOnly: readOnly,
          contextmenu: !readOnly,
          lineNumbers: 'on',
          folding: true,
        }}
      />
    </div>
  );
}
