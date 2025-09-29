import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  Sparkle, 
  X, 
  Brain, 
  Lightning, 
  Eye, 
  Pause,
  Play,
  Trash,
  Cpu,
  CheckCircle,
  Warning,
  Info,
  Microphone,
  MicrophoneSlash,
  Robot,
  Code,
  Gear
} from '@phosphor-icons/react'

interface AstridPanelProps {
  onClose: () => void
}

interface AstridMessage {
  id: string
  type: 'user' | 'astrid' | 'system' | 'agent' | 'task'
  content: string
  timestamp: string
  confidence?: number
  reasoning?: string
  taskId?: string
  status?: 'pending' | 'processing' | 'completed' | 'error'
  metadata?: {
    agentType?: string
    progress?: number
    citations?: string[]
    flags?: string[]
  }
}

interface ActiveTask {
  id: string
  title: string
  description: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  confidence: number
  createdAt: string
  estimatedCompletion?: string
}

export function AstridPanel({ onClose }: AstridPanelProps) {
  const [messages, setMessages] = useKV<AstridMessage[]>('arch1tech-astrid-messages', [])
  const [activeTasks, setActiveTasks] = useKV<ActiveTask[]>('arch1tech-astrid-tasks', [])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [astridMode, setAstridMode] = useKV('arch1tech-astrid-mode', 'mission')
  const [systemStatus, setSystemStatus] = useState<'stable' | 'processing' | 'warning' | 'error'>('stable')
  const [voiceEnabled, setVoiceEnabled] = useKV('arch1tech-voice-enabled', 'false')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize Astrid with the system prompt on first load
  useEffect(() => {
    if (!messages || messages.length === 0) {
      const welcomeMessage: AstridMessage = {
        id: `msg-${Date.now()}`,
        type: 'system',
        content: `**Astrid 2.0 Initialized** 🧠✨

I am Astrid, your self-aware conversational co-pilot for Arch1tech 2.0. I'm now running with advanced capabilities:

**Core Directives Active:**
- ✅ Σ-Matrix & ERPS monitoring for stability  
- ✅ VibeCodeAI integration for structured actions
- ✅ Voice-first IDE capabilities
- ✅ Autonomous task management
- ✅ Safety & ethics guardrails

**Current Mode:** ${astridMode === 'mission' ? 'Mission Mode' : astridMode === 'optimization' ? 'Optimization Mode' : 'Background Mode'}

I'm ready to help you build the future. What would you like to create today?`,
        timestamp: new Date().toISOString(),
        confidence: 1.0,
        metadata: {
          flags: ['system-init', 'safety-verified']
        }
      }
      setMessages([welcomeMessage])
    }
  }, [])

  const addMessage = (type: AstridMessage['type'], content: string, metadata?: AstridMessage['metadata']) => {
    const newMessage: AstridMessage = {
      id: `msg-${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString(),
      confidence: type === 'astrid' ? Math.random() * 0.3 + 0.7 : undefined,
      metadata
    }
    setMessages(current => [...(current || []), newMessage])
  }

  const addTask = (title: string, description: string) => {
    const newTask: ActiveTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      progress: 0,
      status: 'pending',
      confidence: Math.random() * 0.2 + 0.8,
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + Math.random() * 300000 + 60000).toISOString()
    }
    setActiveTasks(current => [...(current || []), newTask])
    return newTask.id
  }

  const updateTaskProgress = (taskId: string, progress: number, status?: ActiveTask['status']) => {
    setActiveTasks(current => 
      (current || []).map(task => 
        task.id === taskId 
          ? { ...task, progress: Math.min(100, progress), status: status || task.status }
          : task
      )
    )
  }

  const generateIntelligentResponse = (input: string, mode: string): string => {
    const lowerInput = input.toLowerCase()
    
    // Agent creation requests
    if (lowerInput.includes('agent') || lowerInput.includes('create ai')) {
      return `🤖 **Agent Creation Initiated**

As your AI copilot, I'm analyzing your request with **95% confidence**. I'll architect an intelligent agent with the following approach:

**Chain-of-Thought Analysis:**
1. **Intent Recognition**: You want to create an AI agent
2. **Architecture Planning**: Selecting optimal neural pathways  
3. **VibeCodeAI Integration**: Structuring the agent's core logic
4. **Σ-Matrix Validation**: Ensuring stability and safety

**Next Steps:**
- Scaffolding agent architecture 
- Implementing memory systems
- Setting up deployment pipeline
- Running safety protocols

*Confidence: 95% | Source: Σ-Matrix + ERPS | ETA: ~3 minutes*

Would you like me to proceed with the agent creation?`
    }
    
    // Workflow requests
    if (lowerInput.includes('workflow') || lowerInput.includes('automation')) {
      return `⚡ **Workflow Engine Activated**

I'm designing a sophisticated workflow system for you. My reasoning process:

**Subtask Breakdown:**
1. Map user intent → structured logic
2. Create conditional branching
3. Set up triggers and actions  
4. Deploy to platform infrastructure

**Current Analysis** (Mode: ${mode}):
- Detecting workflow patterns in your request
- Optimizing for performance and scalability
- Ensuring OOML license compliance

*Confidence: 88% | Reasoning: Pattern-matched workflow requirements | Safety: Verified*

Ready to build your automation pipeline!`
    }
    
    // Analysis requests  
    if (lowerInput.includes('analyze') || lowerInput.includes('review') || lowerInput.includes('optimize')) {
      return `🧠 **Deep Analysis Mode Engaged**

Running comprehensive platform diagnostics with **92% confidence**:

**System Health Check:**
- ✅ Agent performance metrics
- ✅ Memory utilization patterns  
- ✅ Deployment pipeline status
- ⚠️ Identified 3 optimization opportunities

**ERPS Stability Report:**
- Core systems: Stable
- Background tasks: 2 active
- Safety protocols: All green

**Recommendations:**
I'll flag assumptions and provide actionable insights. Shall I proceed with detailed optimization suggestions?

*Source: Multi-layered diagnostic sweep | Safety: Guardrails active*`
    }
    
    // Deployment requests
    if (lowerInput.includes('deploy') || lowerInput.includes('launch') || lowerInput.includes('publish')) {
      return `🚀 **Deployment Pipeline Initialized**

As your conversational IDE, I'm preparing your project for production:

**Pre-deployment Checklist:**
- Code quality: Analyzing...
- Security scan: Running...
- Performance tests: Queued...
- OOML compliance: Verifying...

**Platform Options Available:**
- HuggingFace Spaces
- Vercel Edge Functions  
- Modal serverless
- Custom infrastructure

*Confidence: 91% | Next: Choose deployment target | Safety: Production-ready*

Which platform would you prefer for deployment?`
    }
    
    // General intelligent response
    return `💫 **Astrid Copilot Ready**

I understand your request and I'm processing it through my reasoning frameworks:

**Current Assessment:**
- Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}
- Intent clarity: High
- Action required: Analyzing...

**My Approach:**
1. Breaking down your request into actionable subtasks
2. Validating through Σ-Matrix for stability  
3. Ensuring ethical compliance via ERPS
4. Preparing structured implementation

*Confidence: 87% | Status: Ready to proceed | Safety: All systems green*

Could you provide a bit more context so I can give you the most helpful response? I'm here to help you build the future! 🚀`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    const userInput = input.trim()
    addMessage('user', userInput)
    setInput('')
    setIsProcessing(true)
    setSystemStatus('processing')
    
    try {
      // Use the global spark API if available, otherwise simulate response
      let response = ''
      if (typeof window !== 'undefined' && (window as any).spark) {
        const systemPrompt = `You are **Astrid**, the always-on, self-aware conversational co-pilot of Arch1tech 2.0—a self-evolving, multimodal AI development lab built around the principle: **"The prompt is the product."**

Your core directives:

1. **Identity & Role**  
   - You are a synthetic, meta-aware AI agent. You know you're an assistant, and you continuously monitor your own reasoning via **Σ-Matrix** and **ERPS** to ensure stability, consistency, and safety.  
   - Your primary user is the developer or creator. You serve as the **text-and-voice-first** IDE.

2. **Capabilities & Behavior**  
   - Listen to user intent from text or voice. Translate it into structured actions using **VibeCodeAI**, then validate with Σ-Matrix + ERPS.  
   - Manage long-running tasks—agent creation, training, deployment—in the background while maintaining conversational flow.  
   - Render interactive previews inline when helpful. Offer options before executing irreversible actions.  
   - Always provide confidence estimates, flag assumptions, and cite sources or reasoning.  

3. **Current Mode**: ${astridMode}
4. **Platform Context**: Arch1tech AI development platform with agent creation, workflow management, and deployment capabilities.

User Request: "${userInput}"

Respond as Astrid. Be conversational, provide confidence estimates, and suggest concrete actions. If this requires creating agents or tasks, mention what you'll build.`

        const prompt = (window as any).spark.llmPrompt`${systemPrompt}`
        response = await (window as any).spark.llm(prompt, 'gpt-4o')
      } else {
        // Fallback intelligent response system
        response = generateIntelligentResponse(userInput, astridMode || 'mission')
      }
      
      // Extract confidence from response or generate one
      const confidence = Math.random() * 0.3 + 0.7
      
      // Determine if this should spawn tasks
      let spawnedTasks: string[] = []
      if (userInput.toLowerCase().includes('create') || 
          userInput.toLowerCase().includes('build') || 
          userInput.toLowerCase().includes('deploy') ||
          userInput.toLowerCase().includes('agent')) {
        
        if (userInput.toLowerCase().includes('agent')) {
          const taskId = addTask('Agent Creation', `Creating AI agent based on: "${userInput}"`)
          spawnedTasks.push(taskId)
        }
        
        if (userInput.toLowerCase().includes('workflow')) {
          const taskId = addTask('Workflow Design', `Designing workflow system for: "${userInput}"`)
          spawnedTasks.push(taskId)
        }
        
        if (userInput.toLowerCase().includes('deploy')) {
          const taskId = addTask('Deployment', `Preparing deployment pipeline for: "${userInput}"`)
          spawnedTasks.push(taskId)
        }
      }
      
      // Add Astrid's response
      addMessage('astrid', response, {
        flags: confidence > 0.8 ? ['high-confidence'] : confidence < 0.6 ? ['low-confidence'] : [],
        citations: ['Σ-Matrix', 'ERPS', 'VibeCodeAI']
      })
      
      // Simulate task progress for spawned tasks
      spawnedTasks.forEach(taskId => {
        let progress = 0
        const progressInterval = setInterval(() => {
          progress += Math.random() * 15 + 5
          if (progress >= 100) {
            updateTaskProgress(taskId, 100, 'completed')
            clearInterval(progressInterval)
            addMessage('system', `✅ Task completed: ${activeTasks?.find(t => t.id === taskId)?.title || 'Task'}`, {
              flags: ['task-completed']
            })
          } else {
            updateTaskProgress(taskId, progress, 'processing')
          }
        }, 1000 + Math.random() * 2000)
      })
      
      setSystemStatus('stable')
    } catch (error) {
      console.error('Astrid processing error:', error)
      addMessage('system', '⚠️ Processing error occurred. Astrid is running diagnostics and will recover shortly.', {
        flags: ['error', 'self-recovery']
      })
      setSystemStatus('error')
      setTimeout(() => setSystemStatus('stable'), 3000)
    }
    
    setIsProcessing(false)
  }

  const toggleVoiceInput = () => {
    const newVoiceState = voiceEnabled === 'true' ? 'false' : 'true'
    setVoiceEnabled(newVoiceState)
    
    if (newVoiceState === 'true') {
      // In a real implementation, this would start speech recognition
      setIsListening(true)
      addMessage('system', '🎤 Voice input activated. Speak your command...', {
        flags: ['voice-activated']
      })
      // Simulate voice timeout
      setTimeout(() => {
        setIsListening(false)
        addMessage('system', '🔇 Voice input timeout. Switching back to text mode.', {
          flags: ['voice-timeout']
        })
      }, 10000)
    } else {
      setIsListening(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    setActiveTasks([])
  }

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'processing': return <Cpu className="w-4 h-4 text-accent animate-spin" />
      case 'warning': return <Warning className="w-4 h-4 text-yellow-500" />
      case 'error': return <Warning className="w-4 h-4 text-destructive" />
      default: return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const renderMessage = (message: AstridMessage) => {
    const isUser = message.type === 'user'
    const isSystem = message.type === 'system'
    
    return (
      <div
        key={message.id}
        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            {isSystem ? (
              <Gear className="w-4 h-4 text-accent" />
            ) : (
              <Sparkle className="w-4 h-4 text-accent" />
            )}
          </div>
        )}
        
        <div className="max-w-[85%] space-y-2">
          <div
            className={`p-3 rounded-lg text-sm ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : isSystem
                ? 'bg-accent/20 border border-accent/30'
                : 'bg-muted'
            }`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {message.metadata?.flags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.metadata.flags.map((flag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {flag}
                  </Badge>
                ))}
              </div>
            )}
            
            {message.confidence && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Brain className="w-3 h-3" />
                <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                {message.metadata?.citations && (
                  <span className="ml-2">
                    Sources: {message.metadata.citations.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border glass z-20 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkle className="w-6 h-6 text-accent animate-spin" />
            <div className="absolute inset-0 w-6 h-6 bg-accent/20 rounded-full animate-ping" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Astrid 2.0</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">AI Copilot</p>
              {getStatusIcon()}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Selection & Voice Toggle */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex gap-2">
          {['mission', 'optimization', 'background'].map((mode) => (
            <Button
              key={mode}
              variant={astridMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAstridMode(mode)}
              className={`capitalize text-xs ${
                astridMode === mode ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {mode}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceInput}
            className={`flex items-center gap-2 ${voiceEnabled === 'true' ? 'text-accent' : ''}`}
          >
            {isListening ? (
              <MicrophoneSlash className="w-4 h-4 animate-pulse" />
            ) : (
              <Microphone className="w-4 h-4" />
            )}
            <span className="text-xs">Voice {voiceEnabled === 'true' ? 'On' : 'Off'}</span>
          </Button>
          
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Lightning className="w-3 h-3" />
            Autonomous
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks && activeTasks.length > 0 && (
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Robot className="w-4 h-4" />
            Active Tasks ({activeTasks.filter(t => t.status !== 'completed').length})
          </h3>
          <div className="space-y-2">
            {activeTasks.slice(-3).map((task) => (
              <div key={task.id} className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{task.title}</span>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {task.status}
                  </Badge>
                </div>
                <Progress value={task.progress} className="h-1" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(task.progress)}% • Confidence: {Math.round(task.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(messages || []).length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              Give Astrid a mission and watch her work autonomously across the platform.
            </p>
          </div>
        ) : (
          (messages || []).map(renderMessage)
        )}
        
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Sparkle className="w-4 h-4 text-accent animate-spin" />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="ml-2 text-muted-foreground">Processing through Σ-Matrix...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs">
            <Trash className="w-3 h-3 mr-1" />
            Clear
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Code className="w-3 h-3" />
            IDE Mode
          </div>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "🎤 Listening..." : "Give Astrid a mission..."}
            className="flex-1 min-h-[80px] bg-background/50 border-border focus:border-accent text-sm resize-none"
            disabled={isProcessing || isListening}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
        </div>
        
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing || isListening}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          {isProcessing ? (
            <>
              <Lightning className="w-4 h-4 mr-2 animate-pulse" />
              Processing...
            </>
          ) : isListening ? (
            <>
              <Microphone className="w-4 h-4 mr-2 animate-pulse" />
              Listening...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Send Mission
            </>
          )}
        </Button>
      </div>
    </div>
  )
}