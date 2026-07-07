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
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Sorry, I encountered an error. Please check the backend connection and API keys.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col fade-in max-w-4xl mx-auto">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-t-2xl p-6 shadow-sm flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Assistant</h2>
          <p className="text-sm text-slate-500">Ask questions about allocations, courses, and students in natural language.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 border-x border-slate-200 dark:border-slate-800 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p>No conversation history. Ask a question to begin.</p>
            <div className="mt-8 flex gap-2">
              <span className="text-xs bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setQuery("How many students are allocated?")}>"How many students are allocated?"</span>
              <span className="text-xs bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setQuery("Which course is most popular?")}>"Which course is most popular?"</span>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 fade-in ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 prose dark:prose-invert prose-sm max-w-none rounded-bl-sm'
              }`}>
                {msg.type === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-4 justify-start fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-b-2xl p-4 shadow-sm z-10">
        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about the allocations..."
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shadow-inner rounded-xl pl-5 pr-14 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-all shadow-sm active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
