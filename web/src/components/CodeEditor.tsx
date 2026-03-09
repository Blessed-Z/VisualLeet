"use client";
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export function CodeEditor({ value, onChange, language = 'python' }: CodeEditorProps) {
  return (
    <div className="h-full w-full border border-gray-700 rounded-md overflow-hidden shadow-sm">
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
        }}
      />
    </div>
  );
}
