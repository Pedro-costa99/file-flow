import { useContext } from 'react'
import { ConversionContext } from '../context/conversion-store'
import type { ConversionContextValue } from '../context/conversion-store'

export function useConversions(): ConversionContextValue {
  const context = useContext(ConversionContext)
  if (!context) {
    throw new Error('useConversions precisa ser usado dentro de ConversionProvider')
  }
  return context
}
