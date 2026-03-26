import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

const ChatbotTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your Angelica Assistant. Ask me about our 10-year plans!" }
  ]);

  const [sessionId] = useState(() => `sess-${Math.random().toString(36).substring(2, 10)}`);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const WEBHOOK_URL = 'http://localhost:5678/webhook/583d7f52-e590-4b70-a0b0-38f95e83fa94/chat';

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const currentInput = userInput;
    setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "sendMessage",
          chatInput: currentInput,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botOutput = Array.isArray(data) ? data[0].output : (data.output || data.text);

      setMessages((prev) => [...prev, {
        role: 'bot',
        text: botOutput || "I received your message, but I'm having trouble phrasing my response."
      }]);
    } catch (error) {
      console.error("Error calling n8n:", error);
      setMessages((prev) => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FIX: Removed `fixed bottom-28 right-8 z-[100]` — positioning is now
    // fully controlled by Layout.jsx to avoid covering page content
    <div className="flex flex-col items-end pointer-events-none">

      {/* CHAT WINDOW - pointer-events-auto only when open */}
      <div className={cn(
        "mb-4 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col z-[200]",
        isOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-0 opacity-0 translate-y-10 pointer-events-none"
      )}>
        <div className="bg-[#013F99] p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Angelica AI</p>
              <h3 className="text-lg font-bold">How can we help?</h3>
            </div>
            <span className="text-[8px] opacity-30 select-none">{sessionId}</span>
          </div>
        </div>

        {/* Message Display Area */}
        <div
          ref={scrollRef}
          className="h-[400px] bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "p-3 rounded-2xl text-sm max-w-[85%] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'bot'
                ? "bg-[#013F99] text-white self-start rounded-bl-none"
                : "bg-white text-slate-800 self-end rounded-br-none border border-slate-200"
            )}>
              {msg.role === 'bot' ? (
                <div className="markdown-container prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h3: ({node, ...props}) => <h3 className="text-base font-bold mt-2 mb-1 border-b border-white/20 pb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed text-white/90" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="marker:text-yellow-400" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-extrabold text-yellow-300" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}

          {isLoading && (
            <div className="bg-slate-200 text-slate-500 p-3 rounded-2xl rounded-bl-none text-xs self-start flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Angelica is thinking...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              className="p-2 bg-[#F2C94C] text-[#013F99] rounded-lg hover:bg-yellow-400 disabled:opacity-50 transition-all"
            >
              <Send size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* FAB BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-4 rounded-full shadow-2xl border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto",
          isOpen ? "bg-slate-800 text-white rotate-90" : "bg-[#013F99] text-white"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default ChatbotTrigger;
