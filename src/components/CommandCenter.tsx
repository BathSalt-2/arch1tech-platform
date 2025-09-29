import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  Brain, 
  Lightning, 
  Cpu, 
  Globe, 
  Gear,
  Plus,
  Play,
  Eye
} from '@phosphor-icons/react'

interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'building'
  type: 'chatbot' | 'workflow' | 'api' | 'integration'
  createdAt: string
}

export function CommandCenter() {
  const [agents, setAgents] = useKV<Agent[]>('arch1tech-agents', [])
  const [thoughtInput, setThoughtInput] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)

  const handleCreateAgent = async () => {
    if (!thoughtInput.trim()) return
    
    setIsBuilding(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: `AI Agent ${(agents || []).length + 1}`,
      description: thoughtInput.trim(),
      status: 'active',
      type: 'chatbot',
      createdAt: new Date().toISOString()
    }
    
    setAgents(current => [...(current || []), newAgent])
    setThoughtInput('')
    setIsBuilding(false)
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-accent'
      case 'inactive': return 'text-muted-foreground'
      case 'building': return 'text-primary animate-pulse'
      default: return 'text-muted-foreground'
    }
  }

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'chatbot': return Brain
      case 'workflow': return Lightning
      case 'api': return Cpu
      case 'integration': return Globe
      default: return Brain
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <h1 className="text-4xl font-bold text-glow mb-2">Command Center</h1>
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into intelligent agents. Describe what you want to build and watch it come to life.
        </p>
      </div>

      {/* Thought Input */}
      <Card className="glass p-8 border-glow">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-xl font-semibold">Describe Your Vision</h2>
          </div>
          
          <Textarea
            value={thoughtInput}
            onChange={(e) => setThoughtInput(e.target.value)}
            placeholder="I want to build an AI agent that can help customers with support tickets..."
            className="min-h-32 bg-background/50 border-border focus:border-primary transition-colors resize-none text-base"
            disabled={isBuilding}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {thoughtInput.length > 0 && `${thoughtInput.length} characters`}
            </div>
            <Button
              onClick={handleCreateAgent}
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
                  Create Agent
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

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
            <p className="text-muted-foreground">Create your first AI agent using the input above</p>
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
                            {agent.type}
                          </p>
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {agent.description}
                    </p>
                    
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
  )
}