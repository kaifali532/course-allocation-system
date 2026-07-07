import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, Sparkles, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Assistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/ai/history');
        const history = res.data.data.map((item: any) => ([
          { type: 'user', content: item.query },
          { type: 'ai', content: item.response }
        ])).flat().reverse();
        setMessages(history);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setQuery('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', { query: userMessage });
      setMessages(prev => [...prev, { type: 'ai', content: res.data.response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Sorry, I encountered an error. Please check the backend connection.';
      setMessages(prev => [...prev, { type: 'ai', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col fade-in max-w-4xl mx-auto">
      <div className="bg-[#111118] border border-[#22222a] rounded-t-xl p-6 shadow-sm flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">AI Assistant</h2>
          <p className="text-sm text-slate-400">Ask questions about allocations, courses, and students in natural language.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#0d0d12] border-x border-[#22222a] space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p>No conversation history. Ask a question to begin.</p>
            <div className="mt-8 flex gap-2">
              <span className="text-xs bg-[#1a1a24] text-slate-300 border border-[#2a2a35] px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#22222a] transition-colors" onClick={() => setQuery("How many students are allocated?")}>"How many students are allocated?"</span>
              <span className="text-xs bg-[#1a1a24] text-slate-300 border border-[#2a2a35] px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#22222a] transition-colors" onClick={() => setQuery("Which course is most popular?")}>"Which course is most popular?"</span>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 fade-in ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-inner">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-5 py-3.5 shadow-sm text-sm ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-[#1a1a24] border border-[#2a2a35] text-slate-200 prose dark:prose-invert prose-sm max-w-none rounded-bl-sm prose-p:text-slate-200 prose-strong:text-white'
              }`}>
                {msg.type === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-[#22222a] border border-[#33333f] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-4 justify-start fade-in">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-inner">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#1a1a24] border border-[#2a2a35] rounded-xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#111118] border border-[#22222a] rounded-b-xl p-4 shadow-sm z-10">
        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about the allocations..."
            className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-md pl-4 pr-12 py-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-white placeholder-slate-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#2a2a35] disabled:text-slate-500 text-white rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
