import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Code, 
  GitBranch, 
  Plus, 
  Play, 
  Pause, 
  Trash, 
  PencilSimple as Edit, 
  Copy,
  Download,
  Gear as Settings,
  Eye,
  Lightning,
  Robot,
  ChatCircle as MessageCircle,
  Database,
  Globe
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Agent {
  id: string
  name: string
  description: string
  type: 'chatbot' | 'assistant' | 'analyzer' | 'automation'
  status: 'active' | 'paused' | 'draft'
  created: string
  lastModified: string
  deployments: number
  interactions: number
  code?: string
  prompt?: string
  tags: string[]
}

export function AgentWorkspace() {
  const [agents, setAgents] = useKV<Agent[]>('agents', [])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const createAgent = async (agentData: Partial<Agent>) => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentData.name || 'Untitled Agent',
      description: agentData.description || 'A new AI agent',
      type: agentData.type || 'chatbot',
      status: 'draft',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      deployments: 0,
      interactions: 0,
      tags: agentData.tags || [],
      prompt: agentData.prompt || '',
      code: agentData.code || ''
    }

    setAgents((current = []) => [newAgent, ...current])
    setSelectedAgent(newAgent)
    setIsCreating(false)
    toast.success('Agent created successfully!')
  }

  const updateAgent = (updatedAgent: Agent) => {
    setAgents((current = []) =>
      current.map(agent =>
        agent.id === updatedAgent.id
          ? { ...updatedAgent, lastModified: new Date().toISOString() }
          : agent
      )
    )
    setSelectedAgent(updatedAgent)
    toast.success('Agent updated successfully!')
  }

  const deleteAgent = (agentId: string) => {
    setAgents((current = []) => current.filter(agent => agent.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
    toast.success('Agent deleted successfully!')
  }

  const toggleAgentStatus = (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active'
    updateAgent({ ...agent, status: newStatus })
    toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'paused'}!`)
  }

  const duplicateAgent = (agent: Agent) => {
    const duplicatedAgent: Agent = {
      ...agent,
      id: Date.now().toString(),
      name: `${agent.name} (Copy)`,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'draft',
      deployments: 0,
      interactions: 0
    }

    setAgents((current = []) => [duplicatedAgent, ...current])
    toast.success('Agent duplicated successfully!')
  }

  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'chatbot': return MessageCircle
      case 'assistant': return Robot
      case 'analyzer': return Database
      case 'automation': return Lightning
      default: return Brain
    }
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (selectedAgent) {
    return <AgentEditor agent={selectedAgent} onUpdate={updateAgent} onBack={() => setSelectedAgent(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text font-orbitron">Agent Workspace</h1>
          <p className="text-muted-foreground">Build, deploy, and manage your AI agents</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="glow">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <AgentForm onSubmit={createAgent} onCancel={() => setIsCreating(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold">{agents?.length || 0}</p>
            </div>
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {agents?.filter(a => a.status === 'active').length || 0}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Interactions</p>
              <p className="text-2xl font-bold">
                {agents?.reduce((sum, agent) => sum + agent.interactions, 0) || 0}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-accent" />
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Deployments</p>
              <p className="text-2xl font-bold">
                {agents?.reduce((sum, agent) => sum + agent.deployments, 0) || 0}
              </p>
            </div>
            <Globe className="w-8 h-8 text-secondary" />
          </div>
        </Card>
      </div>

      {/* Agent Grid */}
      {!agents || agents.length === 0 ? (
        <Card className="glass p-12 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
          <p className="text-muted-foreground mb-6">Create your first AI agent to get started</p>
          <Button onClick={() => setIsCreating(true)} className="glow">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Agent
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const IconComponent = getAgentIcon(agent.type)
            return (
              <Card key={agent.id} className="glass p-6 hover:glow-secondary transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <IconComponent className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAgent(agent)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAgentStatus(agent)
                      }}
                    >
                      {agent.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateAgent(agent)
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {agent.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{agent.interactions} interactions</span>
                  <span>{new Date(agent.lastModified).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {agent.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AgentForm({ onSubmit, onCancel }: { 
  onSubmit: (data: Partial<Agent>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'chatbot' as Agent['type'],
    prompt: '',
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My AI Assistant"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What does this agent do?"
          rows={3}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as Agent['type'] })}
          className="w-full px-3 py-2 bg-input border border-border rounded-md"
        >
          <option value="chatbot">Chatbot</option>
          <option value="assistant">Assistant</option>
          <option value="analyzer">Analyzer</option>
          <option value="automation">Automation</option>
        </select>
      </div>
      
      <div>
        <label className="text-sm font-medium">System Prompt</label>
        <Textarea
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          placeholder="You are a helpful AI assistant..."
          rows={3}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Tags (comma-separated)</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="customer-service, automation, chat"
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 glow">
          Create Agent
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function AgentEditor({ agent, onUpdate, onBack }: {
  agent: Agent
  onUpdate: (agent: Agent) => void
  onBack: () => void
}) {
  const [editedAgent, setEditedAgent] = useState(agent)
  const [activeTab, setActiveTab] = useState('settings')

  const handleSave = () => {
    onUpdate(editedAgent)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-muted-foreground">Agent Editor</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="glow">
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editedAgent.name}
                  onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={editedAgent.type}
                  onChange={(e) => setEditedAgent({ ...editedAgent, type: e.target.value as Agent['type'] })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md"
                >
                  <option value="chatbot">Chatbot</option>
                  <option value="assistant">Assistant</option>
                  <option value="analyzer">Analyzer</option>
                  <option value="automation">Automation</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editedAgent.description}
                  onChange={(e) => setEditedAgent({ ...editedAgent, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">System Prompt</h3>
            <Textarea
              value={editedAgent.prompt || ''}
              onChange={(e) => setEditedAgent({ ...editedAgent, prompt: e.target.value })}
              rows={15}
              placeholder="You are a helpful AI assistant..."
              className="font-mono"
            />
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Custom Code</h3>
            <Textarea
              value={editedAgent.code || ''}
              onChange={(e) => setEditedAgent({ ...editedAgent, code: e.target.value })}
              rows={15}
              placeholder="// Custom JavaScript code for your agent"
              className="font-mono"
            />
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-2">Interactions</h3>
              <p className="text-3xl font-bold text-primary">{agent.interactions}</p>
              <p className="text-sm text-muted-foreground">Total conversations</p>
            </Card>
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-2">Deployments</h3>
              <p className="text-3xl font-bold text-accent">{agent.deployments}</p>
              <p className="text-sm text-muted-foreground">Active instances</p>
            </Card>
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-2">Uptime</h3>
              <p className="text-3xl font-bold text-green-400">99.9%</p>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}