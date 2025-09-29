import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  Sparkle, 
  X, 
  Brain, 
  Lightning, 
  Eye, 
  Pause,
  Play,
  Trash
} from '@phosphor-icons/react'

interface AstridPanelProps {
  onClose: () => void
}

interface AstridMessage {
  id: string
  type: 'user' | 'astrid' | 'system'
  content: string
  timestamp: string
}

export function AstridPanel({ onClose }: AstridPanelProps) {
  const [messages, setMessages] = useKV<AstridMessage[]>('arch1tech-astrid-messages', [])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [astridMode, setAstridMode] = useKV('arch1tech-astrid-mode', 'mission')

  const addMessage = (type: AstridMessage['type'], content: string) => {
    const newMessage: AstridMessage = {
      id: `msg-${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(current => [...(current || []), newMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    addMessage('user', input.trim())
    setInput('')
    setIsProcessing(true)
    
    // Simulate Astrid processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate Astrid response based on input
    let response = "I understand your request. I'm analyzing the platform capabilities and will begin implementation shortly."
    
    if (input.toLowerCase().includes('agent')) {
      response = "I'll create an intelligent agent for you. Let me scaffold the architecture and deploy it to the platform."
    } else if (input.toLowerCase().includes('workflow')) {
      response = "I'm designing a workflow system. I'll map out the logic flow and create the necessary integrations."
    } else if (input.toLowerCase().includes('analyze')) {
      response = "Running platform analysis now. I'm reviewing system performance, agent efficiency, and identifying optimization opportunities."
    }
    
    addMessage('astrid', response)
    setIsProcessing(false)
  }

  const clearHistory = () => {
    setMessages([])
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border glass z-20 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkle className="w-6 h-6 text-accent animate-spin" />
            <div className="absolute inset-0 w-6 h-6 bg-accent/20 rounded-full animate-ping" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Astrid</h2>
            <p className="text-xs text-muted-foreground">AI Copilot Active</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Selection */}
      <div className="p-4 border-b border-border">
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
      </div>

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
          (messages || []).map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle className="w-4 h-4 text-accent" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'astrid'
                    ? 'bg-muted'
                    : 'bg-accent/20'
                }`}
              >
                {message.content}
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))
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
              </div>
            </div>
          </div>
        )}
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
            <Lightning className="w-3 h-3" />
            Autonomous
          </div>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Give Astrid a mission..."
            className="flex-1 min-h-[80px] bg-background/50 border-border focus:border-accent text-sm resize-none"
            disabled={isProcessing}
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
          disabled={!input.trim() || isProcessing}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          {isProcessing ? (
            <>
              <Lightning className="w-4 h-4 mr-2 animate-pulse" />
              Processing...
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