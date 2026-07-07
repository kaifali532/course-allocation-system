import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, Sparkles, Bot, User, Trash2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function Assistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await api.delete('/ai/history');
      setMessages([]);
      toast.success('Chat history cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

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
    <div className="h-[calc(100vh-16rem)] min-h-[600px] flex flex-col fade-in max-w-5xl mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-[32px]" />
      
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-t-[32px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex items-center gap-6 z-10 relative">
        <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">AI Assistant</h2>
          <p className="text-white/60 mt-1">Ask questions about allocations, courses, and students in natural language.</p>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={clearHistory}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors font-semibold text-sm border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-black/20 backdrop-blur-xl border-x border-white/5 space-y-8 custom-scrollbar relative z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/50">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-white/10">
              <MessageSquare className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-lg font-bold">No conversation history. Ask a question to begin.</p>
            <div className="mt-10 flex gap-4">
              <span className="text-sm font-semibold bg-white/5 text-white/70 border border-white/10 px-5 py-3 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5" onClick={() => setQuery("How many students are allocated?")}>"How many students are allocated?"</span>
              <span className="text-sm font-semibold bg-white/5 text-white/70 border border-white/10 px-5 py-3 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5" onClick={() => setQuery("Which course is most popular?")}>"Which course is most popular?"</span>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-5 fade-in ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'ai' && (
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-[24px] px-6 py-4 shadow-lg text-[15px] leading-relaxed relative group ${
                msg.type === 'user' 
                  ? 'bg-white text-black rounded-br-sm font-medium' 
                  : 'bg-black/60 border border-white/10 text-white/90 backdrop-blur-md prose dark:prose-invert prose-sm max-w-none rounded-bl-sm prose-p:text-white/90 prose-strong:text-white'
              }`}>
                {msg.type === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                
                {msg.type === 'ai' && (
                  <button 
                    onClick={() => copyToClipboard(msg.content)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white/50 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                    title="Copy response"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              {msg.type === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                  <User className="w-5 h-5 text-white/70" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-5 justify-start fade-in">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-black/60 border border-white/10 backdrop-blur-md rounded-[24px] rounded-bl-sm px-6 py-5 shadow-lg flex gap-2 items-center">
              <div className="w-2.5 h-2.5 bg-white/50 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2.5 h-2.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-b-[32px] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.8)] z-10 relative">
        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about the allocations..."
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl pl-6 pr-16 py-4 focus:ring-1 focus:ring-white/40 focus:border-white/40 outline-none text-[15px] font-medium text-white placeholder-white/30 transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="absolute right-3 p-3 bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
