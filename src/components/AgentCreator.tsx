import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { ensureAgentMetadata } from '@/utils/agentHelpers'
import type { Agent } from '@/utils/agentHelpers'
import { 
  Brain, 
  Lightning, 
  Code, 
  Gear,
  Sparkle,
  CheckCircle,
  Robot,
  Star,
  Cpu,
  Database,
  Network,
  Shield
} from '@phosphor-icons/react'

interface AgentCreatorProps {
  isVisible: boolean
  onClose: () => void
  initialPrompt?: string
}

export function AgentCreator({ isVisible, onClose, initialPrompt }: AgentCreatorProps) {
  const [agents, setAgents] = useKV<Agent[]>('arch1tech-agents', [])
  const [isCreating, setIsCreating] = useState(false)
  const [creationProgress, setCreationProgress] = useState(0)
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    type: 'conversational' as Agent['type'],
    prompt: initialPrompt || ''
  })

  // Ensure all agents have proper metadata structure
  const safeAgents = ensureAgentMetadata(agents)

  useEffect(() => {
    if (initialPrompt) {
      setAgentForm(prev => ({ ...prev, prompt: initialPrompt }))
    }
  }, [initialPrompt])

  const generateAgentCapabilities = (type: Agent['type'], description: string): string[] => {
    const baseCapabilities = ['Natural Language Processing', 'Context Awareness', 'Memory Management']
    
    switch (type) {
      case 'conversational':
        return [...baseCapabilities, 'Dialogue Management', 'Personality Modeling', 'Emotion Recognition']
      case 'task-automation':
        return [...baseCapabilities, 'Workflow Orchestration', 'API Integration', 'Error Handling']
      case 'data-analysis':
        return [...baseCapabilities, 'Pattern Recognition', 'Statistical Analysis', 'Data Visualization']
      case 'creative':
        return [...baseCapabilities, 'Content Generation', 'Style Adaptation', 'Creative Reasoning']
      case 'security':
        return [...baseCapabilities, 'Threat Detection', 'Risk Assessment', 'Compliance Monitoring']
      default:
        return baseCapabilities
    }
  }

  const createAgent = async () => {
    if (!agentForm.name.trim() || !agentForm.description.trim()) return

    setIsCreating(true)
    setCreationProgress(0)

    try {
      // Simulate agent creation process
      const stages = [
        'Initializing Σ-Matrix framework...',
        'Configuring neural pathways...',
        'Setting up memory architecture...',
        'Installing safety protocols...',
        'Training language models...',
        'Optimizing response patterns...',
        'Running validation tests...',
        'Deploying to platform...'
      ]

      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
        setCreationProgress(((i + 1) / stages.length) * 100)
      }

      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentForm.name,
        description: agentForm.description,
        type: agentForm.type,
        capabilities: generateAgentCapabilities(agentForm.type, agentForm.description),
        status: 'deployed',
        confidence: Math.random() * 0.2 + 0.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          memorySize: Math.round(Math.random() * 500 + 100),
          responseTime: Math.round(Math.random() * 200 + 50),
          successRate: Math.round(Math.random() * 15 + 85),
          interactions: 0
        }
      }

      setAgents(current => [...(current || []), newAgent])
      
      // Reset form
      setAgentForm({
        name: '',
        description: '',
        type: 'conversational',
        prompt: ''
      })

    } catch (error) {
      console.error('Agent creation failed:', error)
    } finally {
      setIsCreating(false)
      setCreationProgress(0)
    }
  }

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'conversational': return <Brain className="w-4 h-4" />
      case 'task-automation': return <Gear className="w-4 h-4" />
      case 'data-analysis': return <Database className="w-4 h-4" />
      case 'creative': return <Star className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      default: return <Robot className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'deployed': return 'text-green-500'
      case 'training': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="glass border-accent/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkle className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-xl gradient-text">Agent Creator</CardTitle>
                  <CardDescription>
                    Build intelligent agents with Astrid's guidance
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Agent Creation Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Agent Name</label>
                  <Input
                    value={agentForm.name}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., DataAnalyst Pro"
                    className="bg-background/50 border-border focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Agent Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['conversational', 'task-automation', 'data-analysis', 'creative', 'security'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={agentForm.type === type ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setAgentForm(prev => ({ ...prev, type }))}
                        className={`justify-start ${agentForm.type === type ? 'bg-accent text-accent-foreground' : ''}`}
                      >
                        {getTypeIcon(type)}
                        <span className="ml-2 capitalize text-xs">{type.replace('-', ' ')}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={agentForm.description}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your agent should do..."
                    className="bg-background/50 border-border focus:border-accent min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Initial Prompt (Optional)</label>
                  <Textarea
                    value={agentForm.prompt}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="You are an AI assistant that..."
                    className="bg-background/50 border-border focus:border-accent min-h-[80px]"
                  />
                </div>

                {isCreating && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-accent animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Creating agent with Σ-Matrix architecture...
                      </span>
                    </div>
                    <Progress value={creationProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(creationProgress)}% complete
                    </div>
                  </div>
                )}

                <Button
                  onClick={createAgent}
                  disabled={!agentForm.name.trim() || !agentForm.description.trim() || isCreating}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isCreating ? (
                    <>
                      <Lightning className="w-4 h-4 mr-2 animate-pulse" />
                      Creating Agent...
                    </>
                  ) : (
                    <>
                      <Robot className="w-4 h-4 mr-2" />
                      Create Agent
                    </>
                  )}
                </Button>
              </div>

              {/* Existing Agents */}
              <div>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Your Agents ({agents?.length || 0})
                </h3>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {safeAgents && safeAgents.length > 0 ? (
                    safeAgents.slice().reverse().map((agent) => (
                      <Card key={agent.id} className="bg-muted/50 border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(agent.type)}
                              <h4 className="font-medium text-sm">{agent.name}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {agent.type.replace('-', ' ')}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${agent.status === 'deployed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3">
                            {agent.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              <span>Confidence: {Math.round(agent.confidence * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Lightning className="w-3 h-3" />
                              <span>{agent.metadata.responseTime}ms</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.capabilities.slice(0, 3).map((cap, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{agent.capabilities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Robot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No agents created yet. Start building your first AI agent!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}