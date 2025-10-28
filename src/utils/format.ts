export function formatFileSize(sizeMB: number): string {
  if (sizeMB >= 1024) {
    return `${(sizeMB / 1024).toFixed(1)} GB`
  }
  return `${sizeMB.toFixed(2)} MB`
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('pt-BR', {
    hour12: false,
  })
}

