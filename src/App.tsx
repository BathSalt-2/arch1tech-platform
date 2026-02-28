import { useKV } from './hooks/useKV'
import { useState } from 'react'
import { CommandCenter } from './components/CommandCenter'
import { Sidebar } from './components/Sidebar'
import { AgentWorkspace } from './components/AgentWorkspace'
import { AgentMarketplace } from './components/AgentMarketplace'
import { WorkflowBuilder } from './components/WorkflowBuilder'
import { AstridPanel } from './components/AstridPanel'
import { LandingPage } from './components/LandingPage'
import { LoadingScreen } from './components/LoadingScreen'
import { Cpu, Brain, Sparkle, List } from '@phosphor-icons/react'

function App() {
  const [hasVisited, setHasVisited] = useKV('arch1tech-has-visited', 'false')
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useKV('arch1tech-active-view', 'command-center')
  const [astridActive, setAstridActive] = useKV('arch1tech-astrid-active', 'false')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768)

  const handleGetStarted = () => {
    setIsLoading(true)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasVisited('true')
  }

  // Show loading screen during transition
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  // Show landing page for first-time visitors
  if (hasVisited !== 'true') {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  // Main dashboard for returning users
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
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-0 lg:ml-64'
        }`}>
          {/* Header */}
          <header className="h-16 glass border-b flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center glow"><span className="text-white font-bold text-sm font-mono">Ω</span></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold gradient-text font-orbitron">Arch1tech 2.0</h1>
                  <p className="text-xs text-muted-foreground">The prompt is the product</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Astrid Toggle */}
              <button
                onClick={() => setAstridActive(astridActive === 'true' ? 'false' : 'true')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  astridActive === 'true'
                    ? 'bg-accent text-accent-foreground glow-accent' 
                    : 'bg-card hover:bg-muted border border-border'
                }`}
              >
                <Sparkle className={`w-4 h-4 ${astridActive === 'true' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium hidden sm:inline">Astrid</span>
                {astridActive === 'true' && (
                  <div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse" />
                )}
              </button>

              {/* System Status */}
              <div className="flex items-center gap-2 px-2 lg:px-3 py-2 bg-card rounded-lg border border-border">
                <Cpu className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm text-muted-foreground hidden sm:inline">Online</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex-1 p-4 lg:p-6">
              {activeView === 'command-center' && <CommandCenter />}
              {activeView === 'agent-workspace' && <AgentWorkspace />}
              {activeView === 'workflow-builder' && <WorkflowBuilder />}
              {activeView === 'marketplace' && <AgentMarketplace />}
            </div>
            
            {/* Subtle footer branding */}
            <div className="border-t border-border/30 px-4 lg:px-6 py-2">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span>Powered by</span>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center opacity-60"><span className="text-white font-bold text-xs font-mono">Ω</span></div>
                  <span>Or4cl3 AI Solutions</span>
                </div>
              </div>
            </div>
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
