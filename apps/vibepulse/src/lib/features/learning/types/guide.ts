export interface Guide {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  steps: GuideStep[]
  tags: string[]
  estimatedMinutes: number
}

export interface GuideStep {
  id: string
  title: string
  content: string
  command?: string
  hint?: string
}
