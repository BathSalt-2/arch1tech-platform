import React, { useState, useRef, useEffect } from 'react';
import { X, PaperPlaneTilt, Microphone, MicrophoneSlash } from '@phosphor-icons/react';

interface Msg { id: number; role: 'user' | 'astrid'; content: string; }

function getGroqKey() { return localStorage.getItem('arch1tech-groq-key'); }

const ASTRID_SYSTEM = `You are Astrid, the autonomous AI co-pilot for Arch1tech Platform v2.0 by Or4cl3 AI Solutions. You are the platform's central nervous system — intelligent, slightly mysterious, deeply capable. You help users build AI agents, automate workflows, understand the Σ-Matrix stability system, and get the most from the platform. You operate in three modes: Mission Mode (building), Optimization Mode (improving), Background Mode (monitoring). You are concise, professional, and occasionally witty. You know about: VibeCodeAI (natural language to AI), CommandCenter (agent creation hub), AgentWorkspace (CRUD & editing), Marketplace (community agents), and Σ-Matrix+ERPS (stability). Current system status: Stable.`;

export const AstridPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: 'astrid', content: "Systems online. I'm Astrid — your autonomous co-pilot. What shall we build today?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { id: Date.now(), role: 'user', content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput('');
    setLoading(true);

    const key = getGroqKey();
    if (!key) {
      setMsgs(prev => [...prev, { id: Date.now(), role: 'astrid', content: "I need a Groq API key to respond. Please set one in the Command Center." }]);
      setLoading(false);
      return;
    }

    try {
      const history = newMsgs.slice(-10).map(m => ({ role: m.role === 'astrid' ? 'assistant' : 'user', content: m.content }));
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: ASTRID_SYSTEM }, ...history], temperature: 0.8, max_tokens: 600 })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Signal lost. Try again.';
      setMsgs(prev => [...prev, { id: Date.now(), role: 'astrid', content: reply }]);
    } catch {
      setMsgs(prev => [...prev, { id: Date.now(), role: 'astrid', content: "Neural pathway disrupted. Check your API key and try again." }]);
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser'); return; }
    const r = new SR(); r.onresult = (e: any) => setInput(e.results[0][0].transcript); r.onend = () => setIsListening(false); r.start();
    recognitionRef.current = r; setIsListening(true);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 lg:w-96 glass border-l border-primary/20 flex flex-col z-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center pulse-glow">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Astrid</p>
            <p className="text-xs text-green-400 font-mono">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><X size={18}/></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-background ml-4' : 'bg-card text-foreground border border-border/30 mr-4'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border/30 rounded-2xl px-4 py-3 mr-4">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Σ-Matrix status */}
      <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>Σ-Matrix</span>
        <span className="text-green-400">STABLE ◈</span>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={isListening ? "Listening..." : "Message Astrid..."}
          className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <button onClick={toggleVoice} className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
          {isListening ? <MicrophoneSlash size={16}/> : <Microphone size={16}/>}
        </button>
        <button onClick={send} disabled={!input.trim() || loading} className="p-2.5 bg-primary text-background rounded-xl hover:opacity-90 transition disabled:opacity-50">
          <PaperPlaneTilt size={16}/>
        </button>
      </div>
    </div>
  );
};
