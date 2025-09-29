import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Cpu, Lightning, Sparkle } from '@phosphor-icons/react'
import logoImage from '@/assets/images/image.png'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "Thought-to-App Engine",
      description: "Transform ideas into intelligent agents using natural language"
    },
    {
      icon: Sparkle,
      title: "Astrid AI Copilot",
      description: "Autonomous AI assistant that builds and optimizes for you"
    },
    {
      icon: Lightning,
      title: "Visual Agent Designer",
      description: "Drag-and-drop interface for complex AI workflows"
    },
    {
      icon: Cpu,
      title: "One-Click Deployment",
      description: "Deploy to any platform with a single click"
    }
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="Or4cl3 AI Solutions" 
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full glow float"
              />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold gradient-text font-orbitron">Arch1tech</h1>
              <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">
                Powered by Or4cl3 AI Solutions
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="border-border hover:border-primary transition-colors"
            onClick={onGetStarted}
          >
            Login
          </Button>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 lg:px-8 pt-12 lg:pt-20 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground">
                <Cpu className="w-4 h-4 text-accent animate-pulse" />
                Next-Generation AI Platform
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight font-orbitron">
                Build the{' '}
                <span className="gradient-text">future</span>,<br />
                one thought at a time
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into intelligent AI agents, workflows, and applications
                using natural language. No coding required—just pure imagination.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow group min-w-[200px]"
                onClick={onGetStarted}
              >
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-border hover:border-primary transition-colors min-w-[200px]"
              >
                Watch Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-20">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={feature.title}
                    className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:glow"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Social Proof */}
            <div className="pt-20 space-y-6">
              <p className="text-sm text-muted-foreground">
                Trusted by innovators and creators worldwide
              </p>
              <div className="flex items-center justify-center gap-8 opacity-50">
                {['AI', 'ML', 'NLP', 'LLM'].map((tech) => (
                  <div key={tech} className="px-4 py-2 bg-card rounded-lg border border-border">
                    <span className="text-sm font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img 
                  src={logoImage} 
                  alt="Or4cl3 AI Solutions" 
                  className="w-6 h-6 rounded-full opacity-80"
                />
                <span>© 2024 Or4cl3 AI Solutions. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}