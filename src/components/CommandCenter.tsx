import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { AgentCreator } from './AgentCreator'
import { 
  Brain, 
  Lightning, 
  Cpu, 
  Globe, 
  Gear,
  Plus,
  Play,
  Eye,
  Sparkle,
  Robot,
  Database,
  Shield,
  Star,
  Network,
  WarningCircle
} from '@phosphor-icons/react'

interface Agent {
  id: string
  name: string
  description: string
  type: 'conversational' | 'task-automation' | 'data-analysis' | 'creative' | 'security'
  capabilities: string[]
  status: 'draft' | 'training' | 'deployed' | 'error'
  confidence: number
  createdAt: string
  updatedAt: string
  metadata: {
    memorySize: number
    responseTime: number
    successRate: number
    interactions: number
  }
}

export function CommandCenter() {
  const [agents, setAgents] = useKV<Agent[]>('arch1tech-agents', [])
  const [thoughtInput, setThoughtInput] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)
  const [showAgentCreator, setShowAgentCreator] = useState(false)

  const handleQuickCreate = async () => {
    if (!thoughtInput.trim()) return
    
    setIsBuilding(true)
    
    try {
      // Use the global spark API if available for AI processing
      if (typeof window !== 'undefined' && (window as any).spark) {
        const systemPrompt = `Analyze this user request and create an intelligent agent specification:

User Request: "${thoughtInput}"

Respond with a JSON object containing:
- name: A descriptive agent name
- type: One of: conversational, task-automation, data-analysis, creative, security
- description: Enhanced description of capabilities
- capabilities: Array of 4-6 specific capabilities

Be creative and intelligent about the agent type and capabilities based on the user's request.`

        const prompt = (window as any).spark.llmPrompt`${systemPrompt}`
        const response = await (window as any).spark.llm(prompt, 'gpt-4o', true)
        const agentSpec = JSON.parse(response)
        
        const newAgent: Agent = {
          id: `agent-${Date.now()}`,
          name: agentSpec.name || `AI Agent ${(agents || []).length + 1}`,
          description: agentSpec.description || thoughtInput.trim(),
          type: agentSpec.type || 'conversational',
          capabilities: agentSpec.capabilities || ['Natural Language Processing', 'Context Awareness'],
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
      } else {
        // Fallback for when spark API is not available
        const newAgent: Agent = {
          id: `agent-${Date.now()}`,
          name: `AI Agent ${(agents || []).length + 1}`,
          description: thoughtInput.trim(),
          type: 'conversational',
          capabilities: ['Natural Language Processing', 'Context Awareness', 'Memory Management'],
          status: 'deployed',
          confidence: 0.85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {
            memorySize: 256,
            responseTime: 120,
            successRate: 92,
            interactions: 0
          }
        }
        
        setAgents(current => [...(current || []), newAgent])
      }
      
      setThoughtInput('')
    } catch (error) {
      console.error('Agent creation failed:', error)
    } finally {
      setIsBuilding(false)
    }
  }

  const handleAdvancedCreate = () => {
    setShowAgentCreator(true)
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'deployed': return 'text-green-500'
      case 'training': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'deployed': return <Play className="w-3 h-3" />
      case 'training': return <Gear className="w-3 h-3 animate-spin" />
      case 'error': return <WarningCircle className="w-3 h-3" />
      default: return <Cpu className="w-3 h-3" />
    }
  }

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'conversational': return Brain
      case 'task-automation': return Lightning
      case 'data-analysis': return Database
      case 'creative': return Star
      case 'security': return Shield
      default: return Brain
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold gradient-text mb-2 font-orbitron">Command Center</h1>
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into intelligent agents. Describe what you want to build and watch Astrid bring it to life.
          </p>
        </div>

        {/* Quick Create Section */}
        <Card className="glass p-8 border-glow">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkle className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-xl font-semibold">Quick Agent Creation</h2>
            </div>
            
            <Textarea
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="I want to build an AI agent that can help customers with support tickets..."
              className="min-h-32 bg-background/50 border-border focus:border-primary transition-colors resize-none text-base"
              disabled={isBuilding}
            />
            
            <div className="flex justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {thoughtInput.length > 0 && `${thoughtInput.length} characters`}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAdvancedCreate}
                  variant="outline"
                  className="border-accent/50 hover:border-accent text-accent hover:bg-accent/10"
                >
                  <Gear className="w-4 h-4 mr-2" />
                  Advanced Creator
                </Button>
                <Button
                  onClick={handleQuickCreate}
                  disabled={!thoughtInput.trim() || isBuilding}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow transition-all duration-300 px-8"
                >
                  {isBuilding ? (
                    <>
                      <Gear className="w-4 h-4 mr-2 animate-spin" />
                      Building Agent...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Quick Create
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Agent Statistics */}
        {(agents || []).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass p-4">
              <div className="flex items-center gap-3">
                <Robot className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{(agents || []).length}</div>
                  <div className="text-sm text-muted-foreground">Total Agents</div>
                </div>
              </div>
            </Card>
            <Card className="glass p-4">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {(agents || []).filter(a => a.status === 'deployed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Deployed</div>
                </div>
              </div>
            </Card>
            <Card className="glass p-4">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(((agents || []).reduce((acc, agent) => acc + agent.confidence, 0) / (agents || []).length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </div>
              </div>
            </Card>
            <Card className="glass p-4">
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">
                    {(agents || []).reduce((acc, agent) => acc + agent.metadata.interactions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Interactions</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Active Agents */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Lightning className="w-6 h-6 text-accent" />
              Your Agents
            </h2>
            <div className="text-sm text-muted-foreground">
              {(agents || []).length} agent{(agents || []).length !== 1 ? 's' : ''} created
            </div>
          </div>

          {(agents || []).length === 0 ? (
            <Card className="glass p-12 text-center">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-4">Create your first AI agent using the input above</p>
              <Button onClick={handleAdvancedCreate} variant="outline" className="border-accent/50 hover:border-accent">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(agents || []).map((agent) => {
                const IconComponent = getTypeIcon(agent.type)
                return (
                  <Card key={agent.id} className="glass p-6 hover:glow transition-all duration-300 cursor-pointer group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {agent.name}
                            </h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {agent.type.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={agent.status === 'deployed' ? 'default' : 'secondary'}
                            className={`text-xs ${getStatusColor(agent.status)}`}
                          >
                            {getStatusIcon(agent.status)}
                            <span className="ml-1">{agent.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {agent.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
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

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          <span>{Math.round(agent.confidence * 100)}% confidence</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lightning className="w-3 h-3" />
                          <span>{agent.metadata.responseTime}ms</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-accent/20">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Agent Creator Modal */}
      <AgentCreator
        isVisible={showAgentCreator}
        onClose={() => setShowAgentCreator(false)}
        initialPrompt={thoughtInput}
      />
    </>
  )
}