import React, { useState } from 'react';
import { Sparkle, Plus, Play, GitBranch, Clock, Lightning, Trash, Copy, Code, FlowArrow, DotsThree, X } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'llm' | 'agent' | 'delay' | 'webhook';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  from: string;
  to: string;
  condition?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
  lastRun?: string;
  runCount: number;
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Lightning, color: 'text-yellow-400', description: 'Start workflow on event' },
  { type: 'action', label: 'Action', icon: Play, color: 'text-green-400', description: 'Execute an operation' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-purple-400', description: 'Branch based on logic' },
  { type: 'llm', label: 'LLM Call', icon: Sparkle, color: 'text-cyan-400', description: 'AI prompt execution' },
  { type: 'agent', label: 'Agent', icon: Code, color: 'text-blue-400', description: 'Run an agent task' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'text-orange-400', description: 'Wait before continuing' },
];

function getGroqKey() { return localStorage.getItem('arch1tech-groq-key'); }

async function callGroq(messages: Array<{role: string; content: string}>) {
  const key = getGroqKey();
  if (!key) throw new Error('NO_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, temperature: 0.7, max_tokens: 2000 })
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => 
    JSON.parse(localStorage.getItem('arch1tech-workflows') || '[]')
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);
  const [apiKey, setApiKey] = useState(getGroqKey() || '');
  const [showKeyInput, setShowKeyInput] = useState(!getGroqKey());

  const saveWorkflows = (wfs: Workflow[]) => {
    setWorkflows(wfs);
    localStorage.setItem('arch1tech-workflows', JSON.stringify(wfs));
  };

  const saveKey = () => {
    localStorage.setItem('arch1tech-groq-key', apiKey);
    setShowKeyInput(false);
    toast.success('API key saved');
  };

  const generateWorkflow = async () => {
    if (!description.trim()) {
      toast.error('Please describe your workflow');
      return;
    }
    setIsGenerating(true);
    try {
      const raw = await callGroq([
        {
          role: 'system',
          content: `You are a workflow architect. Generate a workflow specification as JSON with these fields:
- name (string): Clear workflow name
- description (string): What it does
- nodes (array): Each node has: id (string), type (trigger|action|condition|llm|agent|delay), label (string), config (object with relevant settings like prompt, condition, delayMs, etc)
- connections (array): Each has: from (node id), to (node id), condition (optional, for branching)

Example node configs:
- trigger: { eventType: "schedule|webhook|manual", schedule: "daily" }
- action: { actionType: "sendEmail|apiCall|saveData", details: "..." }
- condition: { expression: "value > 100", trueLabel: "Yes", falseLabel: "No" }
- llm: { prompt: "Analyze this...", model: "gpt-4o" }
- agent: { agentName: "Support Agent", task: "..." }
- delay: { delayMs: 5000, reason: "Wait for processing" }

Return ONLY valid JSON.`
        },
        { role: 'user', content: description }
      ]);

      const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
      
      const workflow: Workflow = {
        id: Date.now().toString(),
        name: parsed.name || 'New Workflow',
        description: parsed.description || description,
        nodes: parsed.nodes || [],
        connections: parsed.connections || [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        runCount: 0
      };

      const updated = [workflow, ...workflows];
      saveWorkflows(updated);
      setSelectedWorkflow(workflow);
      setDescription('');
      toast.success('Workflow generated successfully');
    } catch (e: any) {
      if (e.message === 'NO_KEY') {
        toast.error('Please set your Groq API key first');
        setShowKeyInput(true);
      } else {
        toast.error('Generation failed. Check your API key and try again.');
      }
    }
    setIsGenerating(false);
  };

  const createBlankWorkflow = () => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name: 'Untitled Workflow',
      description: 'New workflow',
      nodes: [],
      connections: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      runCount: 0
    };
    const updated = [workflow, ...workflows];
    saveWorkflows(updated);
    setSelectedWorkflow(workflow);
  };

  const deleteWorkflow = (id: string) => {
    const updated = workflows.filter(w => w.id !== id);
    saveWorkflows(updated);
    if (selectedWorkflow?.id === id) setSelectedWorkflow(null);
    toast.success('Workflow deleted');
  };

  const toggleWorkflowStatus = (id: string) => {
    const updated = workflows.map(w => 
      w.id === id 
        ? { ...w, status: (w.status === 'active' ? 'paused' : 'active') as Workflow['status'] }
        : w
    );
    saveWorkflows(updated);
    if (selectedWorkflow?.id === id) {
      const updatedWf = updated.find(w => w.id === id);
      if (updatedWf) setSelectedWorkflow(updatedWf);
    }
  };

  const addNode = (type: string) => {
    if (!selectedWorkflow) return;
    
    const nodeId = `node_${Date.now()}`;
    const newNode: WorkflowNode = {
      id: nodeId,
      type: type as WorkflowNode['type'],
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      config: {},
      position: { x: 100, y: 100 }
    };

    const updated = workflows.map(w => 
      w.id === selectedWorkflow.id
        ? { ...w, nodes: [...w.nodes, newNode] }
        : w
    );
    saveWorkflows(updated);
    const updatedWf = updated.find(w => w.id === selectedWorkflow.id);
    if (updatedWf) setSelectedWorkflow(updatedWf);
    setShowNodePalette(false);
    toast.success('Node added');
  };

  const deleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return;
    
    const updated = workflows.map(w => 
      w.id === selectedWorkflow.id
        ? { 
            ...w, 
            nodes: w.nodes.filter(n => n.id !== nodeId),
            connections: w.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
          }
        : w
    );
    saveWorkflows(updated);
    const updatedWf = updated.find(w => w.id === selectedWorkflow.id);
    if (updatedWf) setSelectedWorkflow(updatedWf);
    toast.success('Node deleted');
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!selectedWorkflow) return;
    
    const updated = workflows.map(w => 
      w.id === selectedWorkflow.id
        ? { 
            ...w, 
            nodes: w.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
          }
        : w
    );
    saveWorkflows(updated);
    const updatedWf = updated.find(w => w.id === selectedWorkflow.id);
    if (updatedWf) setSelectedWorkflow(updatedWf);
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    const duplicate: Workflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      runCount: 0
    };
    const updated = [duplicate, ...workflows];
    saveWorkflows(updated);
    toast.success('Workflow duplicated');
  };

  const runWorkflow = (id: string) => {
    const updated = workflows.map(w => 
      w.id === id 
        ? { ...w, lastRun: new Date().toISOString(), runCount: w.runCount + 1 }
        : w
    );
    saveWorkflows(updated);
    if (selectedWorkflow?.id === id) {
      const updatedWf = updated.find(w => w.id === id);
      if (updatedWf) setSelectedWorkflow(updatedWf);
    }
    toast.success('Workflow executed');
  };

  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    draft: 'bg-muted/50 text-muted-foreground border-border/20'
  };

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    return nodeType?.icon || DotsThree;
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    return nodeType?.color || 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text font-orbitron">Workflow Builder</h2>
          <p className="text-muted-foreground text-sm">Orchestrate AI pipelines with conditional logic</p>
        </div>
        <button 
          onClick={() => setShowKeyInput(!showKeyInput)} 
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
        >
          {getGroqKey() ? '🟢 API Key Set' : '🔴 Set API Key'}
        </button>
      </div>

      {/* API Key Setup */}
      {showKeyInput && (
        <Card className="glass border-primary/20 p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Groq API Key (<a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.groq.com</a>)
          </p>
          <div className="flex gap-2">
            <input 
              type="password" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              placeholder="gsk_..." 
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none font-mono" 
            />
            <Button onClick={saveKey}>Save</Button>
          </div>
        </Card>
      )}

      {/* Text-to-Workflow Generator */}
      <Card className="glass border-primary/10 p-6">
        <h3 className="text-sm font-semibold text-primary font-orbitron mb-3 flex items-center gap-2">
          <Sparkle size={16} /> TEXT-TO-WORKFLOW
        </h3>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your workflow... e.g. 'When a new customer signs up, send a welcome email, wait 24 hours, then assign to sales team if they haven't completed onboarding'"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm resize-none focus:border-primary focus:outline-none h-28 text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-2 mt-3">
          <Button
            onClick={generateWorkflow}
            disabled={isGenerating || !description.trim()}
            className="bg-gradient-to-r from-primary to-secondary text-background font-bold"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkle size={16} />
                Generate Workflow
              </>
            )}
          </Button>
          <Button onClick={createBlankWorkflow} variant="outline">
            <Plus size={16} />
            Blank Workflow
          </Button>
        </div>
      </Card>

      {/* Workflow List & Editor */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground font-orbitron">
            YOUR WORKFLOWS ({workflows.length})
          </h3>
          
          {workflows.length === 0 ? (
            <Card className="glass border-border/30 p-6 text-center">
              <FlowArrow size={48} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No workflows yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first workflow above</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {workflows.map(workflow => (
                <Card
                  key={workflow.id}
                  className={`glass border transition-all cursor-pointer p-4 ${
                    selectedWorkflow?.id === workflow.id
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border/30 hover:border-primary/20'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{workflow.name}</h4>
                    <Badge className={`text-xs ${statusColors[workflow.status]}`}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {workflow.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{workflow.nodes.length} nodes</span>
                    <span>{workflow.runCount} runs</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Workflow Editor */}
        <div className="lg:col-span-2">
          {selectedWorkflow ? (
            <Card className="glass border-border/30 overflow-hidden">
              {/* Editor Header */}
              <div className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{selectedWorkflow.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runWorkflow(selectedWorkflow.id)}
                  >
                    <Play size={14} />
                    Run
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedWorkflow.status === 'active' ? 'default' : 'outline'}
                    onClick={() => toggleWorkflowStatus(selectedWorkflow.id)}
                  >
                    {selectedWorkflow.status === 'active' ? 'Active' : 'Paused'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => duplicateWorkflow(selectedWorkflow)}
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteWorkflow(selectedWorkflow.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>

              {/* Node Canvas */}
              <div className="p-6 bg-background/50 min-h-96 relative">
                {selectedWorkflow.nodes.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FlowArrow size={64} className="text-muted-foreground/20 mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">No nodes yet</p>
                    <Button onClick={() => setShowNodePalette(true)}>
                      <Plus size={16} />
                      Add First Node
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Node List View */}
                    {selectedWorkflow.nodes.map((node, idx) => {
                      const Icon = getNodeIcon(node.type);
                      const color = getNodeColor(node.type);
                      
                      return (
                        <div key={node.id} className="flex gap-3 items-start">
                          {/* Node Card */}
                          <Card className="flex-1 glass border-border/30 p-4 hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg bg-card border border-border/30 ${color}`}>
                                  <Icon size={16} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">{node.label}</h4>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {node.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingNode(node)}
                                  className="p-1 hover:text-primary text-muted-foreground transition-colors"
                                >
                                  <Code size={14} />
                                </button>
                                <button
                                  onClick={() => deleteNode(node.id)}
                                  className="p-1 hover:text-red-400 text-muted-foreground transition-colors"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                            
                            {/* Node Config Preview */}
                            {Object.keys(node.config).length > 0 && (
                              <div className="mt-3 p-2 bg-card/50 rounded border border-border/20">
                                <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
                                  {JSON.stringify(node.config, null, 2)}
                                </pre>
                              </div>
                            )}
                          </Card>
                          
                          {/* Connection Arrow */}
                          {idx < selectedWorkflow.nodes.length - 1 && (
                            <div className="flex flex-col items-center justify-center py-6">
                              <FlowArrow size={24} className="text-primary rotate-90" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Node Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowNodePalette(true)}
                        className="border-dashed"
                      >
                        <Plus size={16} />
                        Add Node
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className="border-t border-border/30 px-6 py-3 bg-card/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created: {new Date(selectedWorkflow.createdAt).toLocaleDateString()}</span>
                  {selectedWorkflow.lastRun && (
                    <span>Last run: {new Date(selectedWorkflow.lastRun).toLocaleString()}</span>
                  )}
                  <span>Total runs: {selectedWorkflow.runCount}</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="glass border-border/30 p-12 flex flex-col items-center justify-center text-center min-h-96">
              <FlowArrow size={64} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Select a workflow to edit</p>
            </Card>
          )}
        </div>
      </div>

      {/* Node Palette Modal */}
      {showNodePalette && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass border-primary/20 p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Node</h3>
              <button
                onClick={() => setShowNodePalette(false)}
                className="p-1 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {nodeTypes.map(nodeType => {
                const Icon = nodeType.icon;
                return (
                  <button
                    key={nodeType.type}
                    onClick={() => addNode(nodeType.type)}
                    className="glass border border-border/30 hover:border-primary/40 p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-card ${nodeType.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="font-semibold">{nodeType.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Node Editor Modal */}
      {editingNode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass border-primary/20 p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Edit Node</h3>
              <button
                onClick={() => setEditingNode(null)}
                className="p-1 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground font-orbitron block mb-1">
                  LABEL
                </label>
                <input
                  value={editingNode.label}
                  onChange={e => setEditingNode({ ...editingNode, label: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground font-orbitron block mb-1">
                  CONFIG (JSON)
                </label>
                <textarea
                  value={JSON.stringify(editingNode.config, null, 2)}
                  onChange={e => {
                    try {
                      const config = JSON.parse(e.target.value);
                      setEditingNode({ ...editingNode, config });
                    } catch {}
                  }}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono resize-none focus:border-primary focus:outline-none h-48"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    updateNode(editingNode.id, { label: editingNode.label, config: editingNode.config });
                    setEditingNode(null);
                    toast.success('Node updated');
                  }}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingNode(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
