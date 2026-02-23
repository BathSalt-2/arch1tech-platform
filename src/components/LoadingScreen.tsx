import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

export const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const steps = [
    { at: 20, msg: 'LOADING NEURAL DRIVERS...' },
    { at: 45, msg: 'CALIBRATING Σ-MATRIX...' },
    { at: 65, msg: 'INITIALIZING VIBECODEAI...' },
    { at: 85, msg: 'SYNCING ASTRID CORE...' },
    { at: 100, msg: 'SYSTEM ONLINE. WELCOME.' },
  ];
  const [status, setStatus] = useState(steps[0].msg);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + Math.random() * 4 + 1, 100);
        const step = steps.find(s => s.at > p && s.at <= next);
        if (step) setStatus(step.msg);
        if (next >= 100) { clearInterval(interval); setTimeout(onComplete, 600); }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center glow pulse-glow mx-auto">
          <span className="text-white font-bold text-3xl font-mono">Ω</span>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold gradient-text font-orbitron tracking-wider">ARCH1TECH</h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">Platform v2.0</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>INITIALIZING</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-primary/70 font-mono animate-pulse">{`> ${status}`}</p>
        </div>
      </div>
    </div>
  );
};
