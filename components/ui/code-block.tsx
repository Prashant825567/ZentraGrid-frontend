'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative rounded-xl overflow-hidden liquid-glass border border-white/12 shadow-2xl bg-[#080A10]/95 font-mono text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-[#FF4FD8]" />
          <span className="text-[11px] font-medium text-slate-300">
            {filename || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white liquid-glass-subtle hover:border-[#FF4FD8]/40 border border-white/10 transition-all"
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#67E8F9]" />
              <span className="text-[#67E8F9]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="flex">
          {showLineNumbers && (
            <div className="select-none pr-4 text-slate-600 text-right font-mono text-xs leading-relaxed border-r border-white/5 mr-4">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-slate-200 leading-relaxed font-mono">
            {lines.map((line, idx) => {
              // Basic high-contrast syntax coloring
              let formattedLine = line;
              const isComment = line.trim().startsWith('//') || line.trim().startsWith('#');
              const isMethod = /^(POST|GET|PATCH|DELETE|PUT)/.test(line.trim());

              return (
                <div key={idx} className={isComment ? 'text-slate-500 italic' : ''}>
                  {isMethod ? (
                    <span>
                      <span className="text-[#FF4FD8] font-bold">{line.split(' ')[0]}</span>
                      <span className="text-slate-200">{line.slice(line.split(' ')[0].length)}</span>
                    </span>
                  ) : line.includes('Authorization:') ? (
                    <span>
                      <span className="text-[#67E8F9]">Authorization:</span>
                      <span className="text-[#FF9BE8]">{line.replace('Authorization:', '')}</span>
                    </span>
                  ) : line.includes('Content-Type:') ? (
                    <span>
                      <span className="text-[#8B5CF6]">Content-Type:</span>
                      <span className="text-slate-300">{line.replace('Content-Type:', '')}</span>
                    </span>
                  ) : (
                    line
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
