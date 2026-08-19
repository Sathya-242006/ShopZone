import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Tag } from 'lucide-react';
import { api } from '../services/api';

interface AiShoppingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

const SUGGESTIONS = [
  'Best noise-cancelling headphones?',
  'Top mechanical keyboard for work',
  'Minimalist desk setup accessories',
  'Available promo codes',
];

export const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI assistant. How can I help you find the right item or recommend products from our catalog today?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isAsking) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const answer = await api.askAiAssistant(text);
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I can guide you through our collection! You can browse the catalog or use coupon code SAVE20 at checkout for 20% off.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div
      id="ai-assistant-modal"
      className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200 h-[520px]"
    >
      {/* Assistant Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              Shopping Assistant
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Gemini-Powered Product Concierge</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs shadow-2xs'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-xs shadow-2xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isAsking && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-xs text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
        {SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer shrink-0"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask about products, specs, or deals..."
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isAsking}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-full transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
