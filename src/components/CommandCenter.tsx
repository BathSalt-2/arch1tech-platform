import React, { useState } from 'react';
import { Sparkle, Plus, Robot, Copy, Trash } from '@phosphor-icons/react';

interface Agent {
  id: number;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
  type: string;
  status: 'active' | 'draft';
  createdAt: string;
}

function getGroqKey() { return localStorage.getItem('arch1tech-groq-key'); }

async function callGroq(messages: Array<{role: string; content: string}>) {
  const key = getGroqKey();
  if (!key) throw new Error('NO_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, temperature: 0.7, max_tokens: 1500 })
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export const CommandCenter: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAgent, setGeneratedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>(() => JSON.parse(localStorage.getItem('arch1tech-agents') || '[]'));
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(getGroqKey() || '');
  const [showKeyInput, setShowKeyInput] = useState(!getGroqKey());

  const saveKey = () => {
    localStorage.setItem('arch1tech-groq-key', apiKey);
    setShowKeyInput(false);
  };

  const generate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError('');
    setGeneratedAgent(null);
    try {
      const raw = await callGroq([
        { role: 'system', content: 'Generate an AI agent specification as JSON. Fields: name (string), role (string), type (chatbot|assistant|analyzer|automation|security), description (string), capabilities (string array of 4-6 items), systemPrompt (string, detailed), persona (string). Return ONLY valid JSON.' },
        { role: 'user', content: description }
      ]);
      const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
      const agent: Agent = { id: Date.now(), ...parsed, status: 'draft', createdAt: new Date().toISOString() };
      setGeneratedAgent(agent);
    } catch (e: any) {
      setError(e.message === 'NO_KEY' ? 'Please set your Groq API key first.' : 'Generation failed. Check your API key.');
    }
    setIsGenerating(false);
  };

  const saveAgent = () => {
    if (!generatedAgent) return;
    const active = { ...generatedAgent, status: 'active' as const };
    const updated = [...agents, active];
    setAgents(updated);
    localStorage.setItem('arch1tech-agents', JSON.stringify(updated));
    setGeneratedAgent(null);
    setDescription('');
  };

  const deleteAgent = (id: number) => {
    const updated = agents.filter(a => a.id !== id);
    setAgents(updated);
    localStorage.setItem('arch1tech-agents', JSON.stringify(updated));
  };

  const copyPrompt = (prompt: string) => navigator.clipboard.writeText(prompt);

  const typeColors: Record<string, string> = {
    chatbot: 'text-cyan-400', assistant: 'text-purple-400', analyzer: 'text-blue-400',
    automation: 'text-green-400', security: 'text-red-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text font-orbitron">Command Center</h2>
          <p className="text-muted-foreground text-sm">Build AI agents from natural language</p>
        </div>
        <button onClick={() => setShowKeyInput(!showKeyInput)} className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
          {getGroqKey() ? '🟢 API Key Set' : '🔴 Set API Key'}
        </button>
      </div>

      {/* API Key Setup */}
      {showKeyInput && (
        <div className="glass rounded-xl p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Groq API Key (<a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.groq.com</a>)</p>
          <div className="flex gap-2">
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="gsk_..." className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none font-mono" />
            <button onClick={saveKey} className="px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm hover:opacity-90">Save</button>
          </div>
        </div>
      )}

      {/* Quick Create */}
      <div className="glass rounded-xl p-6 border border-primary/10">
        <h3 className="text-sm font-semibold text-primary font-orbitron mb-3 flex items-center gap-2">
          <Sparkle size={16} /> QUICK CREATE
        </h3>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your agent... e.g. 'A customer support agent that handles billing inquiries, escalates complex issues, and maintains a friendly tone'"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm resize-none focus:border-primary focus:outline-none h-28 text-foreground placeholder:text-muted-foreground"
        />
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <button
          onClick={generate}
          disabled={isGenerating || !description.trim()}
          className="mt-3 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Plus size={16} /> Generate Agent</>
          )}
        </button>
      </div>

      {/* Generated Agent Preview */}
      {generatedAgent && (
        <div className="glass rounded-xl p-6 border border-primary/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Robot size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-foreground">{generatedAgent.name}</h3>
                <span className={`text-xs font-mono ${typeColors[generatedAgent.type] || 'text-muted-foreground'}`}>[{generatedAgent.type}]</span>
              </div>
              <p className="text-sm text-muted-foreground">{generatedAgent.role}</p>
            </div>
            <button onClick={saveAgent} className="px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm hover:opacity-90">
              Deploy Agent ✓
            </button>
          </div>
          <p className="text-sm text-foreground/80 mb-4">{generatedAgent.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-primary mb-2 font-orbitron">CAPABILITIES</p>
              <ul className="space-y-1">
                {generatedAgent.capabilities?.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-primary">◈</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-primary font-orbitron">SYSTEM PROMPT</p>
                <button onClick={() => copyPrompt(generatedAgent.systemPrompt)} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Copy size={12} /> Copy
                </button>
              </div>
              <div className="bg-card rounded-lg p-3 text-xs text-muted-foreground font-mono max-h-32 overflow-y-auto">
                {generatedAgent.systemPrompt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Gallery */}
      {agents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground font-orbitron mb-3">YOUR AGENTS ({agents.length})</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="glass rounded-xl p-4 border border-border/30 hover:border-primary/20 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Robot size={16} className="text-primary" />
                    <span className="text-sm font-semibold">{agent.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyPrompt(agent.systemPrompt)} className="p-1 hover:text-primary text-muted-foreground transition-colors"><Copy size={12} /></button>
                    <button onClick={() => deleteAgent(agent.id)} className="p-1 hover:text-red-400 text-muted-foreground transition-colors"><Trash size={12} /></button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{agent.role}</p>
                <span className={`text-xs font-mono ${typeColors[agent.type] || 'text-muted-foreground'}`}>[{agent.type}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
