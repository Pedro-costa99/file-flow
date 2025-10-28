import type { PlanId } from './plans'

export type ConversionFormat = {
  id: string
  from: string
  to: string
  category: 'document' | 'image' | 'audio' | 'video' | 'archive'
  label: string
}

export const CONVERSION_LIBRARY: ConversionFormat[] = [
  { id: 'pdf-docx', from: 'pdf', to: 'docx', category: 'document', label: 'PDF -> DOCX' },
  { id: 'docx-pdf', from: 'docx', to: 'pdf', category: 'document', label: 'DOCX -> PDF' },
  { id: 'jpg-png', from: 'jpg', to: 'png', category: 'image', label: 'JPG -> PNG' },
  { id: 'png-jpg', from: 'png', to: 'jpg', category: 'image', label: 'PNG -> JPG' },
  { id: 'pptx-pdf', from: 'pptx', to: 'pdf', category: 'document', label: 'PPTX -> PDF' },
  { id: 'pdf-pptx', from: 'pdf', to: 'pptx', category: 'document', label: 'PDF -> PPTX' },
  { id: 'xlsx-csv', from: 'xlsx', to: 'csv', category: 'document', label: 'XLSX -> CSV' },
  { id: 'heic-jpg', from: 'heic', to: 'jpg', category: 'image', label: 'HEIC -> JPG' },
  { id: 'wav-mp3', from: 'wav', to: 'mp3', category: 'audio', label: 'WAV -> MP3' },
  { id: 'mp3-wav', from: 'mp3', to: 'wav', category: 'audio', label: 'MP3 -> WAV' },
  { id: 'mp4-webm', from: 'mp4', to: 'webm', category: 'video', label: 'MP4 -> WEBM' },
  { id: 'mov-mp4', from: 'mov', to: 'mp4', category: 'video', label: 'MOV -> MP4' },
  { id: 'zip-7z', from: 'zip', to: '7z', category: 'archive', label: 'ZIP -> 7Z' },
  { id: 'ai-pdf', from: 'ai', to: 'pdf', category: 'image', label: 'AI -> PDF' },
]

const LIMITED_SET = new Set(['pdf-docx', 'docx-pdf', 'jpg-png', 'png-jpg'])
const EXTENDED_SET = new Set([
  'pdf-docx',
  'docx-pdf',
  'jpg-png',
  'png-jpg',
  'pptx-pdf',
  'pdf-pptx',
  'xlsx-csv',
  'wav-mp3',
  'mp3-wav',
  'mp4-webm',
  'mov-mp4',
])

export function getAllowedConversions(planId: PlanId): ConversionFormat[] {
  if (planId === 'unlimited') {
    return CONVERSION_LIBRARY
  }

  if (planId === 'light' || planId === 'basic') {
    return CONVERSION_LIBRARY.filter((item) => EXTENDED_SET.has(item.id))
  }

  return CONVERSION_LIBRARY.filter((item) => LIMITED_SET.has(item.id))
}

export function getTargetsForSource(planId: PlanId, sourceExtension: string): ConversionFormat[] {
  const formats = getAllowedConversions(planId)
  return formats.filter(
    (format) => format.from.toLowerCase() === sourceExtension.toLowerCase(),
  )
}

export function getConversionLabel(id: string): string {
  return CONVERSION_LIBRARY.find((item) => item.id === id)?.label ?? id
}


