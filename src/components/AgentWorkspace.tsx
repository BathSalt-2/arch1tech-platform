import React, { useState } from 'react';
import { Robot, PencilSimple, Trash, Play, Pause } from '@phosphor-icons/react';

interface Agent {
  id: number;
  name: string;
  role: string;
  type: string;
  systemPrompt: string;
  capabilities?: string[];
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
}

export const AgentWorkspace: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(() => JSON.parse(localStorage.getItem('arch1tech-agents') || '[]'));
  const [selected, setSelected] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'prompt' | 'analytics'>('settings');
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Agent>>({});

  const save = (agents: Agent[]) => {
    setAgents(agents);
    localStorage.setItem('arch1tech-agents', JSON.stringify(agents));
  };

  const toggleStatus = (id: number) => {
    const updated = agents.map(a => a.id === id ? { ...a, status: (a.status === 'active' ? 'paused' : 'active') as Agent['status'] } : a);
    save(updated);
    if (selected?.id === id) setSelected(updated.find(a => a.id === id) || null);
  };

  const deleteAgent = (id: number) => {
    const updated = agents.filter(a => a.id !== id);
    save(updated);
    if (selected?.id === id) setSelected(null);
  };

  const saveEdit = () => {
    if (!selected) return;
    const updated = agents.map(a => a.id === selected.id ? { ...a, ...editValues } : a);
    save(updated);
    const updated_sel = updated.find(a => a.id === selected.id) || null;
    setSelected(updated_sel);
    setEditing(false);
  };

  const statusColors = { active: 'text-green-400', paused: 'text-yellow-400', draft: 'text-muted-foreground' };

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Robot size={64} className="text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No agents yet</h3>
        <p className="text-sm text-muted-foreground mt-2">Go to Command Center to create your first agent</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Agent List */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground font-orbitron mb-3">AGENTS ({agents.length})</h3>
        {agents.map(agent => (
          <button
            key={agent.id}
            onClick={() => { setSelected(agent); setActiveTab('settings'); setEditing(false); }}
            className={`w-full text-left glass rounded-xl p-3 border transition-colors ${selected?.id === agent.id ? 'border-primary/40 bg-primary/5' : 'border-border/30 hover:border-primary/20'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Robot size={14} className="text-primary flex-shrink-0" />
              <span className="text-sm font-semibold truncate">{agent.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{agent.role}</span>
              <span className={`text-xs ${statusColors[agent.status]}`}>●</span>
            </div>
          </button>
        ))}
      </div>

      {/* Editor Panel */}
      {selected ? (
        <div className="flex-1 glass rounded-xl border border-border/30 overflow-hidden">
          {/* Header */}
          <div className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.role}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(selected.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selected.status === 'active' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}`}>
                {selected.status === 'active' ? <><Pause size={12}/> Pause</> : <><Play size={12}/> Activate</>}
              </button>
              {!editing && <button onClick={() => { setEditing(true); setEditValues({ name: selected.name, role: selected.role, systemPrompt: selected.systemPrompt }); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-xs font-semibold hover:bg-muted/80"><PencilSimple size={12}/> Edit</button>}
              <button onClick={() => deleteAgent(selected.id)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors"><Trash size={16}/></button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border/30 px-6 flex gap-4">
            {(['settings', 'prompt', 'analytics'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{tab}</button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {editing ? (
                  <>
                    <div><label className="text-xs font-semibold text-muted-foreground font-orbitron block mb-1">NAME</label>
                    <input value={editValues.name || ''} onChange={e => setEditValues({...editValues, name: e.target.value})} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground font-orbitron block mb-1">ROLE</label>
                    <input value={editValues.role || ''} onChange={e => setEditValues({...editValues, role: e.target.value})} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm">Save Changes</button>
                      <button onClick={() => setEditing(false)} className="px-4 py-2 bg-muted font-semibold rounded-lg text-sm">Cancel</button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {([['Name', selected.name], ['Role', selected.role], ['Type', selected.type], ['Status', selected.status], ['Created', new Date(selected.createdAt).toLocaleDateString()]] as [string, string][]).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-border/20">
                        <span className="text-xs font-semibold text-muted-foreground font-orbitron">{k}</span>
                        <span className="text-sm text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'prompt' && (
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground font-orbitron">SYSTEM PROMPT</p>
                  <button onClick={() => navigator.clipboard.writeText(selected.systemPrompt)} className="text-xs text-primary hover:underline">Copy</button>
                </div>
                {editing ? (
                  <textarea value={editValues.systemPrompt || ''} onChange={e => setEditValues({...editValues, systemPrompt: e.target.value})} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono h-64 resize-none focus:border-primary focus:outline-none" />
                ) : (
                  <div className="bg-card rounded-lg p-4 text-sm font-mono text-muted-foreground whitespace-pre-wrap">{selected.systemPrompt}</div>
                )}
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {([['Total Runs', '—'], ['Avg Response', '< 2s'], ['Success Rate', '98.2%'], ['Memory Usage', '2.1 KB'], ['Uptime', `${Math.floor((Date.now() - selected.id) / 3600000)}h`], ['Σ-Matrix', 'Stable ✓']] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="bg-card rounded-xl p-4 border border-border/30">
                    <p className="text-xs text-muted-foreground font-orbitron mb-1">{k}</p>
                    <p className="text-lg font-bold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select an agent to view details</p>
        </div>
      )}
    </div>
  );
};
