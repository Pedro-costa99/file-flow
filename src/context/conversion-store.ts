import { createContext } from 'react'
import type { PlanId } from '../data/plans'

export type ConversionStatus = 'queued' | 'processing' | 'completed' | 'failed'

export type ConversionRecord = {
  id: string
  fileName: string
  sourceFormat: string
  targetFormat: string
  sizeMB: number
  status: ConversionStatus
  progress: number
  createdAt: string
  completedAt?: string
  planUsed: PlanId
  priorityLabel: string
  downloadUrl?: string
  downloadFileName?: string
}

export type StartConversionInput = {
  file: File
  targetFormat: string
  planId: PlanId
}

export type ConversionContextValue = {
  conversions: ConversionRecord[]
  activeConversions: ConversionRecord[]
  startConversion: (
    input: StartConversionInput,
  ) => { success: true } | { success: false; message: string }
  resetHistory: () => void
}

export const ConversionContext = createContext<ConversionContextValue | undefined>(undefined)
