export type PlanId = 'free' | 'light' | 'basic' | 'unlimited'

export type Plan = {
  id: PlanId
  name: string
  description: string
  price: string
  priceNote?: string
  highlight?: string
  limits: {
    maxFileSizeMB: number | null
    maxConcurrent: number | null
    priorityLabel: string
    speedMultiplier: number
    allowedConversionGroups: 'limited' | 'extended' | 'all'
  }
  perks: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Ideal para testes rápidos e conversões esporádicas.',
    price: '$0',
    priceNote: 'sem login',
    limits: {
      maxFileSizeMB: 100,
      maxConcurrent: 5,
      priorityLabel: 'Fila pública',
      speedMultiplier: 0.6,
      allowedConversionGroups: 'limited',
    },
    perks: [
      'Até 100 MB por arquivo',
      '5 conversões simultâneas',
      'Formatos populares (PDF <-> DOCX, JPG <-> PNG)',
    ],
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Para freelancers que precisam de velocidade com custo baixo.',
    price: '$9.99',
    limits: {
      maxFileSizeMB: 500,
      maxConcurrent: 25,
      priorityLabel: 'Alta prioridade',
      speedMultiplier: 0.85,
      allowedConversionGroups: 'extended',
    },
    perks: [
      'Ate 500 MB por arquivo',
      '25 conversões simultâneas',
      'Fila prioritaria',
      'Biblioteca estendida de formatos',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Para pequenas equipes que precisam de mais capacidade.',
    price: '$14.99',
    limits: {
      maxFileSizeMB: 1024,
      maxConcurrent: 50,
      priorityLabel: 'Prioridade maior',
      speedMultiplier: 1,
      allowedConversionGroups: 'extended',
    },
    perks: [
      'Ate 1 GB por arquivo',
      '50 conversões simultâneas',
      'Fila priorizada',
      'Versões e compressoes extras',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    description: 'Para empresas que precisam do máximo de flexibilidade.',
    price: '$25.99',
    highlight: 'Mais popular',
    limits: {
      maxFileSizeMB: null,
      maxConcurrent: null,
      priorityLabel: 'Prioridade máxima',
      speedMultiplier: 1.25,
      allowedConversionGroups: 'all',
    },
    perks: [
      'Arquivos e simultaneidade ilimitados',
      'Prioridade máxima em todas as filas',
      'Conversões avançadas (CAD, AI, RAW)',
      'Suporte dedicado 24/7',
    ],
  },
]

export function getPlanById(planId: PlanId): Plan {
  const plan = PLANS.find((item) => item.id === planId)
  if (!plan) {
    throw new Error(`Plan "${planId}" not found`)
  }
  return plan
}


