import { useEffect, useState } from 'react'
import { Brain, Cpu, Sparkle } from '@phosphor-icons/react'
import logoImage from '@/assets/images/image.png'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing AI Systems...')

  const loadingSteps = [
    'Initializing Σ-Matrix framework...',
    'Loading VibeCodeAI engine...',
    'Calibrating ERPS monitoring...',
    'Establishing Astrid 2.0 connection...',
    'Syncing agent protocols...',
    'Ready for creation...'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        
        // Update loading text based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex])
        }
        
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
        
        {/* Rotating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <img 
              src={logoImage} 
              alt="Or4cl3 AI Solutions" 
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full glow spin-slow"
            />
            <div className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 border-2 border-primary/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text font-orbitron">Arch1tech 2.0</h1>
          <p className="text-muted-foreground text-sm">
            The prompt is the product
          </p>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6">
          {/* AI Icons Animation */}
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg animate-pulse">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Cpu className="w-6 h-6 text-secondary" />
            </div>
            <div className="p-3 bg-accent/10 rounded-lg animate-pulse" style={{ animationDelay: '1s' }}>
              <Sparkle className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
              <span className="text-muted-foreground">Complete</span>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-foreground font-medium animate-pulse">
              {loadingText}
            </p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className={`p-3 bg-card rounded-lg border transition-all duration-300 ${
            progress > 20 ? 'border-primary glow' : 'border-border'
          }`}>
            <div className="text-xs text-center space-y-1">
              <div className={`w-2 h-2 rounded-full mx-auto ${
                progress > 20 ? 'bg-primary' : 'bg-muted'
              }`} />
              <span className="text-muted-foreground">Core</span>
            </div>
          </div>
          
          <div className={`p-3 bg-card rounded-lg border transition-all duration-300 ${
            progress > 60 ? 'border-secondary glow-secondary' : 'border-border'
          }`}>
            <div className="text-xs text-center space-y-1">
              <div className={`w-2 h-2 rounded-full mx-auto ${
                progress > 60 ? 'bg-secondary' : 'bg-muted'
              }`} />
              <span className="text-muted-foreground">Astrid</span>
            </div>
          </div>
          
          <div className={`p-3 bg-card rounded-lg border transition-all duration-300 ${
            progress > 90 ? 'border-accent glow-accent' : 'border-border'
          }`}>
            <div className="text-xs text-center space-y-1">
              <div className={`w-2 h-2 rounded-full mx-auto ${
                progress > 90 ? 'bg-accent' : 'bg-muted'
              }`} />
              <span className="text-muted-foreground">Deploy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}