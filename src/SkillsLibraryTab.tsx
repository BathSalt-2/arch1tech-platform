import React, { useState } from 'react';
import { Search, Zap, Brain, Palette, Cog, GitBranch, ShoppingCart, Rocket, Users, Handshake, Star, Gamepad2 } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  capabilities: string[];
  triggers: string[];
  color: string;
}

const SKILLS: Skill[] = [
  {
    id: 'agent-builder',
    name: 'Agent Builder',
    icon: <Brain className="w-6 h-6" />,
    description: 'Create AI agents from natural language specifications',
    capabilities: ['Multi-step workflows', 'Tool integration', 'Custom prompts'],
    triggers: ['Voice commands', 'API calls', 'File uploads'],
    color: 'cyan',
  },
  {
    id: 'memory-manager',
    name: 'Memory Manager',
    icon: <Brain className="w-6 h-6" />,
    description: 'Persistent storage & context fusion across sessions',
    capabilities: ['Vector storage', 'Context retrieval', 'Memory pruning'],
    triggers: ['Session start', 'Query expansion', 'Context refresh'],
    color: 'purple',
  },
  {
    id: 'ui-generator',
    name: 'UI Generator',
    icon: <Palette className="w-6 h-6" />,
    description: 'Dynamic holographic interfaces from prompts',
    capabilities: ['Real-time rendering', 'Theme customization', 'Responsive design'],
    triggers: ['Design briefs', 'Component requests', 'Theme changes'],
    color: 'pink',
  },
  {
    id: 'platform-orchestrator',
    name: 'Platform Orchestrator',
    icon: <Cog className="w-6 h-6" />,
    description: 'Main AI creation hub & resource coordinator',
    capabilities: ['Multi-repo sync', 'Deployment management', 'Load balancing'],
    triggers: ['Deploy commands', 'Status checks', 'Resource alerts'],
    color: 'blue',
  },
  {
    id: 'workflow-designer',
    name: 'Workflow Designer',
    icon: <GitBranch className="w-6 h-6" />,
    description: 'Visual automation pipelines & process flows',
    capabilities: ['Drag-and-drop UI', 'Conditional logic', 'Data mapping'],
    triggers: ['Process creation', 'Flow updates', 'Automation runs'],
    color: 'green',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: <ShoppingCart className="w-6 h-6" />,
    description: 'Share & fork agents, skills, and workflows',
    capabilities: ['Versioning', 'Ratings', 'Usage analytics'],
    triggers: ['Share requests', 'Fork commands', 'Listing updates'],
    color: 'yellow',
  },
  {
    id: 'deployment-manager',
    name: 'Deployment Manager',
    icon: <Rocket className="w-6 h-6" />,
    description: 'API & webhook deployment with auto-scaling',
    capabilities: ['API endpoints', 'Webhooks', 'Container support'],
    triggers: ['Deploy triggers', 'Status monitoring', 'Rollback commands'],
    color: 'orange',
  },
  {
    id: 'crew-integrator',
    name: 'Crew Integrator',
    icon: <Users className="w-6 h-6" />,
    description: 'Multi-agent crew coordination & communication',
    capabilities: ['Agent routing', 'Message queuing', 'Consensus protocols'],
    triggers: ['Crew assembly', 'Task delegation', 'Crew monitoring'],
    color: 'indigo',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: <Handshake className="w-6 h-6" />,
    description: 'Real-time team features & shared workspaces',
    capabilities: ['Live editing', 'Comments', 'Permissions'],
    triggers: ['Invite users', 'Share docs', 'Comment threads'],
    color: 'teal',
  },
  {
    id: 'astrid-copilot',
    name: 'Astrid Co-pilot',
    icon: <Star className="w-6 h-6" />,
    description: 'Autonomous optimization & continuous improvement',
    capabilities: ['Performance tuning', 'Bug detection', 'Suggestions'],
    triggers: ['Run analysis', 'Error detection', 'Optimization requests'],
    color: 'fuchsia',
  },
  {
    id: 'model-playground',
    name: 'Model Playground',
    icon: <Gamepad2 className="w-6 h-6" />,
    description: 'Custom LLM tuning, chaining & experimentation',
    capabilities: ['Model selection', 'Parameter tuning', 'Chain creation'],
    triggers: ['Model requests', 'Test runs', 'Parameter changes'],
    color: 'rose',
  },
];

interface SkillsLibraryTabProps {
  onActivateSkill?: (skillName: string, description: string) => void;
}

export default function SkillsLibraryTab({ onActivateSkill }: SkillsLibraryTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    skill.triggers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-400/30 bg-cyan-500/5 hover:bg-cyan-500/10',
    purple: 'border-purple-400/30 bg-purple-500/5 hover:bg-purple-500/10',
    pink: 'border-pink-400/30 bg-pink-500/5 hover:bg-pink-500/10',
    blue: 'border-blue-400/30 bg-blue-500/5 hover:bg-blue-500/10',
    green: 'border-green-400/30 bg-green-500/5 hover:bg-green-500/10',
    yellow: 'border-yellow-400/30 bg-yellow-500/5 hover:bg-yellow-500/10',
    orange: 'border-orange-400/30 bg-orange-500/5 hover:bg-orange-500/10',
    indigo: 'border-indigo-400/30 bg-indigo-500/5 hover:bg-indigo-500/10',
    teal: 'border-teal-400/30 bg-teal-500/5 hover:bg-teal-500/10',
    fuchsia: 'border-fuchsia-400/30 bg-fuchsia-500/5 hover:bg-fuchsia-500/10',
    rose: 'border-rose-400/30 bg-rose-500/5 hover:bg-rose-500/10',
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto bg-gradient-to-br from-slate-900 to-slate-800">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-400" />
          Skills Library
        </h2>
        <p className="text-slate-400">Explore and activate AI skills • Σ-Matrix & ERPS enabled</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search skills by name, capability, or trigger..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${colorClasses[skill.color]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-lg">
                {skill.icon}
              </div>
              <Zap className="w-4 h-4 text-yellow-400/60" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>
            <p className="text-sm text-slate-300 mb-3">{skill.description}</p>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-slate-400">
                <span className="font-semibold">Capabilities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.capabilities.map((cap) => (
                    <span key={cap} className="px-2 py-0.5 bg-slate-700/50 rounded text-slate-300">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-semibold">Triggers:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.triggers.map((trig) => (
                    <span key={trig} className="px-2 py-0.5 bg-slate-700/50 rounded text-slate-300">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onActivateSkill?.(skill.name, skill.description)}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded font-semibold transition-all duration-200 text-sm"
            >
              ⚡ Activate {skill.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Search className="w-12 h-12 mb-2 opacity-50" />
          <p>No skills match "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
