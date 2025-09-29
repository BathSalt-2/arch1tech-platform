import { Button } from '@/components/ui/button'
import { 
  House, 
  Brain, 
  ShoppingBag, 
  Gear, 
  Users,
  ChartLine,
  Code,
  Question,
  List,
  X
} from '@phosphor-icons/react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeView: string
  onViewChange: (view: string) => void
}

const navigation = [
  { id: 'command-center', label: 'Command Center', icon: House },
  { id: 'agent-workspace', label: 'Agent Workspace', icon: Brain },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: ChartLine },
  { id: 'integrations', label: 'Integrations', icon: Code },
  { id: 'team', label: 'Team', icon: Users },
]

const secondaryItems = [
  { id: 'settings', label: 'Settings', icon: Gear },
  { id: 'help', label: 'Help', icon: Question },
]

export function Sidebar({ collapsed, onToggle, activeView, onViewChange }: SidebarProps) {
  return (
    <div className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-10 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Arch1tech</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-muted"
          >
            {collapsed ? <List className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon
            const isActive = activeView === item.id
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onViewChange(item.id)}
                className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground glow' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                } ${collapsed ? 'px-3' : 'px-4'}`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Button>
            )
          })}
        </nav>

        {/* Secondary Items */}
        <div className="p-4 border-t border-border space-y-2">
          {secondaryItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeView === item.id
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onViewChange(item.id)}
                className={`w-full justify-start gap-3 h-10 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                } ${collapsed ? 'px-3' : 'px-4'}`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate text-sm">{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}