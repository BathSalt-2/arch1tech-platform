/**
 * Helper functions for agent management
 */

export interface Agent {
  id: string
  name: string
  description: string
  type: 'conversational' | 'task-automation' | 'data-analysis' | 'creative' | 'security'
  capabilities: string[]
  status: 'draft' | 'training' | 'deployed' | 'error'
  confidence: number
  createdAt: string
  updatedAt: string
  metadata: {
    memorySize: number
    responseTime: number
    successRate: number
    interactions: number
  }
}

/**
 * Ensures all agents have proper metadata structure
 * This prevents runtime errors when accessing metadata properties
 */
export function ensureAgentMetadata(agents: Partial<Agent>[] | null | undefined): Agent[] {
  if (!agents) return []
  
  return agents.map(agent => ({
    id: agent.id || '',
    name: agent.name || '',
    description: agent.description || '',
    type: agent.type || 'conversational',
    capabilities: agent.capabilities || [],
    status: agent.status || 'draft',
    confidence: agent.confidence || 0,
    createdAt: agent.createdAt || new Date().toISOString(),
    updatedAt: agent.updatedAt || new Date().toISOString(),
    metadata: agent.metadata || {
      memorySize: 256,
      responseTime: 120,
      successRate: 92,
      interactions: 0
    }
  }))
}

/**
 * Safe accessor for agent metadata
 */
export function getAgentMetadata(agent: Agent) {
  return agent.metadata || {
    memorySize: 256,
    responseTime: 120,
    successRate: 92,
    interactions: 0
  }
}