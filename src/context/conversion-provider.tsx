'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { getPlanById } from '../data/plans'
import { ConversionContext, type ConversionContextValue, type ConversionRecord, type StartConversionInput } from './conversion-store'
import { guessMimeType, deriveOutputFileName } from './conversion-utils'

export function ConversionProvider({ children }: PropsWithChildren): ReactNode {
  const [conversions, setConversions] = useState<ConversionRecord[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const clearTimer = useCallback((id: string) => {
    const timerId = timersRef.current.get(id)
    if (timerId) {
      window.clearInterval(timerId)
      timersRef.current.delete(id)
    }
  }, [])

  const startConversion = useCallback(
    ({ file, targetFormat, planId }: StartConversionInput) => {
      const plan = getPlanById(planId)
      const sizeMB = Number((file.size / 1024 / 1024).toFixed(2))
      const activeCount = conversions.filter((conv) => conv.status === 'processing').length

      if (plan.limits.maxFileSizeMB && sizeMB > plan.limits.maxFileSizeMB) {
        return {
          success: false as const,
          message: `Seu plano permite até ${plan.limits.maxFileSizeMB} MB por arquivo.`,
        }
      }

      if (plan.limits.maxConcurrent && activeCount >= plan.limits.maxConcurrent) {
        return {
          success: false as const,
          message: `Você atingiu o limite de ${plan.limits.maxConcurrent} conversões simultâneas.`,
        }
      }

      const sourceFormat = file.name.split('.').pop()?.toLowerCase() ?? 'desconhecido'
      const id = crypto.randomUUID?.() ?? `conv-${Date.now()}`
      const createdAt = new Date().toISOString()
      const downloadFileName = deriveOutputFileName(file.name, targetFormat)

      const newConversion: ConversionRecord = {
        id,
        fileName: file.name,
        sourceFormat,
        targetFormat,
        sizeMB,
        status: 'processing',
        progress: 4,
        createdAt,
        planUsed: planId,
        priorityLabel: plan.limits.priorityLabel,
        downloadFileName,
      }

      setConversions((prev) => [newConversion, ...prev])

      const targetDuration = Math.max(4000, 9000 / plan.limits.speedMultiplier)
      const startedAt = Date.now()

      const intervalId = window.setInterval(() => {
        setConversions((prev) =>
          prev.map((conv) => {
            if (conv.id !== id) return conv

            const elapsed = Date.now() - startedAt
            const progress = Math.min(100, Math.round((elapsed / targetDuration) * 100))

            if (elapsed >= targetDuration) {
              clearTimer(id)
              const downloadUrl = URL.createObjectURL(
                new Blob([file], { type: guessMimeType(targetFormat) }),
              )
              return {
                ...conv,
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString(),
                downloadUrl,
              }
            }

            return { ...conv, progress }
          }),
        )
      }, 240)

      timersRef.current.set(id, intervalId)

      return { success: true as const }
    },
    [clearTimer, conversions],
  )

  const resetHistory = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearInterval(timerId))
    timersRef.current.clear()
    setConversions((prev) => {
      prev.forEach((conv) => {
        if (conv.downloadUrl) {
          URL.revokeObjectURL(conv.downloadUrl)
        }
      })
      return []
    })
  }, [])

  const value = useMemo<ConversionContextValue>(() => {
    const activeConversions = conversions.filter((conv) => conv.status === 'processing')
    return {
      conversions,
      activeConversions,
      startConversion,
      resetHistory,
    }
  }, [conversions, resetHistory, startConversion])

  return <ConversionContext.Provider value={value}>{children}</ConversionContext.Provider>
}
