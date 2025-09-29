import { Card } from '@/components/ui/card'
import { Brain, Code, GitBranch } from '@phosphor-icons/react'

export function AgentWorkspace() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <h1 className="text-4xl font-bold text-glow mb-2">Agent Workspace</h1>
          <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visual design studio for building and customizing AI agents with drag-and-drop simplicity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass p-8 text-center hover:glow-secondary transition-all duration-300">
          <Brain className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Logic Designer</h3>
          <p className="text-muted-foreground">Build agent reasoning with visual nodes</p>
        </Card>

        <Card className="glass p-8 text-center hover:glow-accent transition-all duration-300">
          <GitBranch className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flow Builder</h3>
          <p className="text-muted-foreground">Create complex workflows visually</p>
        </Card>

        <Card className="glass p-8 text-center hover:glow transition-all duration-300">
          <Code className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Code Editor</h3>
          <p className="text-muted-foreground">Fine-tune with direct code access</p>
        </Card>
      </div>

      <Card className="glass p-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🚧</div>
          <h2 className="text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The visual agent workspace is under construction. Soon you'll be able to design agents with a powerful drag-and-drop interface.
          </p>
        </div>
      </Card>
    </div>
  )
}