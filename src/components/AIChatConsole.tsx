'use client';

import React, { useState, useEffect, useRef } from 'react';
import { OnboardingData, LogEntry, compileAIResponse } from '../lib/ecoStore';
import { Terminal, Send, Trash2, Cpu } from 'lucide-react';

interface AIChatConsoleProps {
  onboardingData: OnboardingData;
  logs: LogEntry[];
}

interface ChatMessage {
  sender: 'user' | 'system';
  text: string;
  timestamp: string;
}

export default function AIChatConsole({ onboardingData, logs }: AIChatConsoleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial system greeting message
    const greetMsg = compileAIResponse('', onboardingData, logs);
    setHistory([
      {
        sender: 'system',
        text: greetMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
  }, [onboardingData, logs]);

  // Scroll to bottom on updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, typing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || typing) return;

    sendMessage(input);
  };

  const sendMessage = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: time,
    };

    setHistory((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Dynamic typewriter response latency delay
    setTimeout(() => {
      const aiReply = compileAIResponse(text, onboardingData, logs);
      const systemMsg: ChatMessage = {
        sender: 'system',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setHistory((prev) => [...prev, systemMsg]);
      setTyping(false);
    }, 800);
  };

  const handleClear = () => {
    setHistory([]);
    sendMessage(''); // triggers default diagnostic
  };

  const prompts = [
    { label: 'Transport Diagnostic', query: 'run transport diagnostic report' },
    { label: 'Grid Energy Optimization', query: 'run grid energy optimization parameters' },
    { label: '5-Year Forecast', query: 'forecast my carbon projection footprint' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 font-mono text-xs relative overflow-hidden flex flex-col min-h-[500px] max-h-[600px] justify-between">
      {/* Background glow matrix */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header info */}
      <div className="flex justify-between items-center border-b border-indigo-500/15 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider">[SYS_LLM_CO2_CONSULTANT]</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase">// SECURITY: ENCRYPTED</span>
          <button
            onClick={handleClear}
            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggestion Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(p.query)}
            className="px-3 py-1.5 rounded-lg border border-indigo-500/10 bg-slate-950/60 hover:bg-cyan-500/5 hover:border-cyan-500/35 transition-all text-slate-400 text-[10px] text-left uppercase"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Dialog History Stream */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 max-h-[360px] scrollbar-thin">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1 text-[9px] text-slate-500">
              <span>{msg.sender === 'user' ? '[OPERATOR_QUERY]' : '[ECOSPHERE_AI]'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>
            <div
              className={`p-4 rounded-2xl max-w-[90%] whitespace-pre-wrap leading-relaxed text-xs border ${
                msg.sender === 'user'
                  ? 'bg-slate-900 border-indigo-500/10 text-white'
                  : 'bg-slate-950/80 border-indigo-500/20 text-cyan-300 shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2 text-cyan-400 animate-pulse text-[10px] font-bold">
            <Cpu className="w-3.5 h-3.5 animate-spin" /> [COMPILING_CO2_ALGORITHMS_IN_LOCATIONS...]
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Form Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-indigo-500/15 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask EcoSphere AI (e.g. 'how to save energy' or 'predict')..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-indigo-500/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-cyan-505 bg-cyan-500 text-slate-950 font-bold transition-all hover:bg-cyan-400 shadow-md shadow-cyan-500/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
