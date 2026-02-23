import React from 'react';
import { Brain, ArrowRight, Zap, Shield, Cpu } from '@phosphor-icons/react';

interface Props { onGetStarted: () => void; }

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] animate-pulse" style={{animationDelay:'1s'}} />
      
      <div className="relative z-10 text-center space-y-8 p-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center glow float">
            <span className="text-white font-bold text-4xl font-mono">Ω</span>
          </div>
        </div>
        
        {/* Title */}
        <div>
          <h1 className="text-6xl md:text-8xl font-bold gradient-text font-orbitron tracking-tighter mb-2">
            ARCH1TECH
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-4" />
          <p className="text-lg text-primary/80 font-mono tracking-widest uppercase">Platform v2.0</p>
        </div>
        
        {/* Tagline */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The self-evolving AI development lab. Build agents, create custom LLMs, and automate workflows — all from natural language.
        </p>
        <p className="text-primary font-semibold italic">&quot;The prompt is the product.&quot;</p>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {[
            { icon: Brain, label: "VibeCodeAI", desc: "Natural language to AI agents" },
            { icon: Zap, label: "Astrid Co-Pilot", desc: "Always-on autonomous assistant" },
            { icon: Shield, label: "Σ-Matrix + ERPS", desc: "Epistemic stability & safety" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-xl p-4 border border-primary/10 hover:border-primary/30 transition-colors">
              <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-white font-semibold font-orbitron text-sm">{label}</h3>
              <p className="text-muted-foreground text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-secondary text-background font-bold font-orbitron text-lg rounded-xl hover:opacity-90 transition-all glow hover:scale-105"
        >
          Initialize System <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        {/* Footer tag */}
        <div className="flex justify-center gap-6 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1"><Cpu size={10}/> SYSTEM ONLINE</span>
          <span className="flex items-center gap-1"><Shield size={10}/> Σ-MATRIX ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
