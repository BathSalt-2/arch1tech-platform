import React, { useState } from 'react';
import { MagnifyingGlass, Download, Star } from '@phosphor-icons/react';

const ITEMS = [
  { id: 1, name: "GitHub PR Summarizer", type: "agent", category: "DevOps", downloads: 1247, rating: 4.8, desc: "Summarizes PRs and generates review comments automatically", tags: ["github","automation"] },
  { id: 2, name: "Customer Support Pro", type: "agent", category: "Business", downloads: 3421, rating: 4.9, desc: "Multi-language support agent with sentiment detection", tags: ["support","nlp"] },
  { id: 3, name: "ResearchBot Alpha", type: "agent", category: "Research", downloads: 892, rating: 4.7, desc: "Searches and synthesizes research papers into insights", tags: ["research","academic"] },
  { id: 4, name: "CodeGenius 7B", type: "model", category: "Dev", downloads: 5102, rating: 4.9, desc: "Fine-tuned LLM for code generation and debugging", tags: ["code","typescript"] },
  { id: 5, name: "LegalEagle Assistant", type: "agent", category: "Legal", downloads: 634, rating: 4.6, desc: "Contract analysis and compliance checking agent", tags: ["legal","contracts"] },
  { id: 6, name: "DataInsight Analyst", type: "agent", category: "Analytics", downloads: 2189, rating: 4.8, desc: "Transforms raw data descriptions into Python analysis", tags: ["analytics","python"] },
  { id: 7, name: "CreativeWriter Pro", type: "model", category: "Creative", downloads: 4321, rating: 4.7, desc: "Custom-tuned model for storytelling and content", tags: ["creative","writing"] },
  { id: 8, name: "DevOps Orchestrator", type: "workflow", category: "DevOps", downloads: 1567, rating: 4.8, desc: "Automated CI/CD monitoring and incident response", tags: ["devops","cicd"] },
  { id: 9, name: "Medical Triage Bot", type: "agent", category: "Healthcare", downloads: 423, rating: 4.5, desc: "Symptom collection and triage routing agent", tags: ["healthcare","triage"] },
  { id: 10, name: "SalesGenius CRM", type: "agent", category: "Sales", downloads: 2876, rating: 4.9, desc: "Lead scoring and email personalization agent", tags: ["sales","crm"] },
  { id: 11, name: "TinyFinance 3B", type: "model", category: "Finance", downloads: 1092, rating: 4.6, desc: "Small accurate financial analysis model", tags: ["finance","analysis"] },
  { id: 12, name: "ContentPipeline Pro", type: "workflow", category: "Marketing", downloads: 3245, rating: 4.8, desc: "Research → draft → edit → schedule content workflow", tags: ["content","marketing"] },
];

const typeColors: Record<string, string> = { agent: 'text-cyan-400 bg-cyan-400/10', model: 'text-purple-400 bg-purple-400/10', workflow: 'text-green-400 bg-green-400/10' };

export const AgentMarketplace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [installed, setInstalled] = useState<number[]>([]);

  const items = ITEMS.filter(item => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.tags.some(t => t.includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const install = (id: number) => setInstalled(prev => [...prev, id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text font-orbitron">Marketplace</h2>
        <p className="text-muted-foreground text-sm">Discover community agents, models, and workflows</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search marketplace..." className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {['all', 'agent', 'model', 'workflow'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:text-foreground'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="glass rounded-xl p-5 border border-border/30 hover:border-primary/20 transition-colors flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${typeColors[item.type]}`}>{item.type}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 flex-1">{item.desc}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map(t => <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">#{t}</span>)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Download size={10}/> {item.downloads.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400"/> {item.rating}</span>
              </div>
              <button
                onClick={() => install(item.id)}
                disabled={installed.includes(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${installed.includes(item.id) ? 'bg-green-500/10 text-green-400 cursor-default' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {installed.includes(item.id) ? '✓ Installed' : 'Clone & Use'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
