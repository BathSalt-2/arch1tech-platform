import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Download, 
  Heart, 
  Star, 
  MagnifyingGlass as Search,
  Fire,
  Clock,
  TrendUp,
  Robot,
  ChatCircle as MessageCircle,
  Database,
  Lightning,
  Globe,
  Users,
  Shield,
  Check
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface MarketplaceAgent {
  id: string
  name: string
  description: string
  longDescription: string
  type: 'chatbot' | 'assistant' | 'analyzer' | 'automation'
  author: string
  avatar: string
  downloads: number
  rating: number
  reviews: number
  price: number // 0 for free
  tags: string[]
  category: string
  featured: boolean
  trending: boolean
  verified: boolean
  screenshots: string[]
  created: string
  updated: string
}

const SAMPLE_AGENTS: MarketplaceAgent[] = [
  {
    id: '1',
    name: 'Customer Support Pro',
    description: 'Advanced customer support chatbot with sentiment analysis',
    longDescription: 'A sophisticated AI assistant designed to handle customer inquiries with emotional intelligence. Features automatic sentiment detection, escalation protocols, and multi-language support.',
    type: 'chatbot',
    author: 'AI Solutions Inc',
    avatar: '🤖',
    downloads: 12543,
    rating: 4.8,
    reviews: 432,
    price: 0,
    tags: ['customer-service', 'sentiment-analysis', 'multilingual'],
    category: 'Business',
    featured: true,
    trending: true,
    verified: true,
    screenshots: [],
    created: '2024-01-15T00:00:00Z',
    updated: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    name: 'Data Analyst Expert',
    description: 'Analyze complex datasets and generate insights automatically',
    longDescription: 'Transform raw data into actionable insights with this powerful AI analyst. Supports CSV, JSON, and database connections with automatic visualization generation.',
    type: 'analyzer',
    author: 'DataCorp',
    avatar: '📊',
    downloads: 8921,
    rating: 4.6,
    reviews: 287,
    price: 29,
    tags: ['data-analysis', 'visualization', 'insights'],
    category: 'Analytics',
    featured: true,
    trending: false,
    verified: true,
    screenshots: [],
    created: '2024-01-10T00:00:00Z',
    updated: '2024-01-18T00:00:00Z'
  },
  {
    id: '3',
    name: 'Social Media Manager',
    description: 'Automate social media posting and engagement',
    longDescription: 'Schedule posts, engage with followers, and analyze social media performance across multiple platforms. Includes content generation and hashtag optimization.',
    type: 'automation',
    author: 'SocialBot Studios',
    avatar: '📱',
    downloads: 15632,
    rating: 4.7,
    reviews: 891,
    price: 0,
    tags: ['social-media', 'automation', 'marketing'],
    category: 'Marketing',
    featured: false,
    trending: true,
    verified: true,
    screenshots: [],
    created: '2024-01-05T00:00:00Z',
    updated: '2024-01-22T00:00:00Z'
  },
  {
    id: '4',
    name: 'Personal Assistant AI',
    description: 'Your 24/7 virtual assistant for productivity and organization',
    longDescription: 'Manage your calendar, set reminders, draft emails, and handle daily tasks. Integrates with popular productivity tools and learns your preferences over time.',
    type: 'assistant',
    author: 'ProductivityAI',
    avatar: '🎯',
    downloads: 22341,
    rating: 4.9,
    reviews: 1205,
    price: 15,
    tags: ['productivity', 'calendar', 'email', 'tasks'],
    category: 'Productivity',
    featured: true,
    trending: false,
    verified: true,
    screenshots: [],
    created: '2023-12-28T00:00:00Z',
    updated: '2024-01-21T00:00:00Z'
  },
  {
    id: '5',
    name: 'Code Review Assistant',
    description: 'Automated code review and security analysis',
    longDescription: 'Enhance your development workflow with AI-powered code reviews. Detects bugs, security vulnerabilities, and suggests optimizations across 20+ programming languages.',
    type: 'analyzer',
    author: 'DevTools Pro',
    avatar: '💻',
    downloads: 7832,
    rating: 4.5,
    reviews: 156,
    price: 49,
    tags: ['development', 'code-review', 'security'],
    category: 'Development',
    featured: false,
    trending: true,
    verified: true,
    screenshots: [],
    created: '2024-01-12T00:00:00Z',
    updated: '2024-01-19T00:00:00Z'
  },
  {
    id: '6',
    name: 'E-commerce Chatbot',
    description: 'Boost sales with intelligent product recommendations',
    longDescription: 'Increase conversions with a smart shopping assistant that understands customer preferences, provides personalized recommendations, and handles the entire sales process.',
    type: 'chatbot',
    author: 'RetailAI Solutions',
    avatar: '🛍️',
    downloads: 18765,
    rating: 4.6,
    reviews: 623,
    price: 0,
    tags: ['e-commerce', 'sales', 'recommendations'],
    category: 'E-commerce',
    featured: false,
    trending: false,
    verified: true,
    screenshots: [],
    created: '2024-01-08T00:00:00Z',
    updated: '2024-01-20T00:00:00Z'
  }
]

export function AgentMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('trending')
  const [installedAgents, setInstalledAgents] = useKV<string[]>('installed-marketplace-agents', [])
  const [favorites, setFavorites] = useKV<string[]>('favorite-marketplace-agents', [])

  const categories = ['all', 'Business', 'Analytics', 'Marketing', 'Productivity', 'Development', 'E-commerce']

  const filteredAgents = SAMPLE_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'trending': return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      case 'popular': return b.downloads - a.downloads
      case 'rating': return b.rating - a.rating
      case 'newest': return new Date(b.created).getTime() - new Date(a.created).getTime()
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      default: return 0
    }
  })

  const installAgent = (agentId: string) => {
    setInstalledAgents((current = []) => 
      current.includes(agentId) ? current : [...current, agentId]
    )
    toast.success('Agent installed successfully!')
  }

  const toggleFavorite = (agentId: string) => {
    setFavorites((current = []) => 
      current.includes(agentId) 
        ? current.filter(id => id !== agentId)
        : [...current, agentId]
    )
    toast.success(favorites?.includes(agentId) ? 'Removed from favorites' : 'Added to favorites')
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'chatbot': return MessageCircle
      case 'assistant': return Robot
      case 'analyzer': return Database
      case 'automation': return Lightning
      default: return Brain
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text font-orbitron">Agent Marketplace</h1>
          <p className="text-muted-foreground">Discover, install, and share AI agents</p>
        </div>
        
        <Button className="glow">
          <Users className="w-4 h-4 mr-2" />
          Publish Agent
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{SAMPLE_AGENTS.length}</p>
            <p className="text-sm text-muted-foreground">Total Agents</p>
          </div>
        </Card>
        <Card className="glass p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{SAMPLE_AGENTS.filter(a => a.featured).length}</p>
            <p className="text-sm text-muted-foreground">Featured</p>
          </div>
        </Card>
        <Card className="glass p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{installedAgents?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Installed</p>
          </div>
        </Card>
        <Card className="glass p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{SAMPLE_AGENTS.filter(a => a.price === 0).length}</p>
            <p className="text-sm text-muted-foreground">Free</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md"
          >
            <option value="trending">Trending</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </Card>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => {
              const IconComponent = getAgentIcon(agent.type)
              const isInstalled = installedAgents?.includes(agent.id)
              const isFavorited = favorites?.includes(agent.id)
              
              return (
                <Card key={agent.id} className="glass p-6 hover:glow-secondary transition-all duration-300 group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{agent.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{agent.name}</h3>
                          {agent.verified && (
                            <Shield className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">by {agent.author}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {agent.featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                      {agent.trending && <Fire className="w-4 h-4 text-orange-400" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{agent.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{agent.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground">
                      {agent.price === 0 ? 'Free' : `$${agent.price}`}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(agent.tags || []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(agent.tags || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(agent.tags || []).length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      variant={isInstalled ? "outline" : "default"}
                      onClick={() => installAgent(agent.id)}
                      disabled={isInstalled}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Installed
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleFavorite(agent.id)}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-400' : ''}`} />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredAgents.map((agent) => {
              const IconComponent = getAgentIcon(agent.type)
              const isInstalled = installedAgents?.includes(agent.id)
              const isFavorited = favorites?.includes(agent.id)
              
              return (
                <Card key={agent.id} className="glass p-6 hover:glow-secondary transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{agent.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{agent.name}</h3>
                          {agent.verified && <Shield className="w-4 h-4 text-primary" />}
                          {agent.featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                          {agent.trending && <Fire className="w-4 h-4 text-orange-400" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>by {agent.author}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{agent.rating} ({agent.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{agent.downloads.toLocaleString()} downloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">
                          {agent.price === 0 ? 'Free' : `$${agent.price}`}
                        </div>
                        <div className="text-xs text-muted-foreground">{agent.category}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant={isInstalled ? "outline" : "default"}
                          onClick={() => installAgent(agent.id)}
                          disabled={isInstalled}
                        >
                          {isInstalled ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Installed
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Install
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleFavorite(agent.id)}
                        >
                          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-400' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {filteredAgents.length === 0 && (
        <Card className="glass p-12 text-center">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or browse different categories</p>
        </Card>
      )}
    </div>
  )
}