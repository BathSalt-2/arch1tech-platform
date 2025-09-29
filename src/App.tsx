import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { CommandCenter } from './components/CommandCenter'
import { Sidebar } from './components/Sidebar'
import { AgentWorkspace } from './components/AgentWorkspace'
import { AstridPanel } from './components/AstridPanel'
import { Cpu, Brain, Sparkle } from '@phosphor-icons/react'

function App() {
  const [activeView, setActiveView] = useKV('arch1tech-active-view', 'command-center')
  const [astridActive, setAstridActive] = useKV('arch1tech-astrid-active', 'false')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-1 h-1 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-primary rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView || 'command-center'}
          onViewChange={setActiveView}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Header */}
          <header className="h-16 glass border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Brain className="w-8 h-8 text-primary animate-pulse" />
                  <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full animate-ping" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-glow">Arch1tech</h1>
                  <p className="text-xs text-muted-foreground">Build the future, one thought at a time</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Astrid Toggle */}
              <button
                onClick={() => setAstridActive(astridActive === 'true' ? 'false' : 'true')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  astridActive === 'true'
                    ? 'bg-accent text-accent-foreground glow-accent' 
                    : 'bg-card hover:bg-muted border border-border'
                }`}
              >
                <Sparkle className={`w-4 h-4 ${astridActive === 'true' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Astrid</span>
                {astridActive === 'true' && (
                  <div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse" />
                )}
              </button>

              {/* System Status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                <Cpu className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm text-muted-foreground">System Online</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="h-[calc(100vh-4rem)] p-6">
            {activeView === 'command-center' && <CommandCenter />}
            {activeView === 'agent-workspace' && <AgentWorkspace />}
            {activeView === 'marketplace' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-2">Agent Marketplace</h2>
                  <p className="text-muted-foreground">Coming soon - Discover and share AI agents</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Astrid Panel */}
        {astridActive === 'true' && (
          <AstridPanel onClose={() => setAstridActive('false')} />
        )}
      </div>
    </div>
  )
}

export default App