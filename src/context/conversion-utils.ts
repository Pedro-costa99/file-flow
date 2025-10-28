export function deriveOutputFileName(originalName: string, targetExtension: string) {
  const normalizedExtension = targetExtension.replace(/^\./, '').toLowerCase()
  const base = originalName.includes('.')
    ? originalName.replace(/\.[^/.]+$/, '')
    : originalName
  return `${base}.${normalizedExtension}`
}

export function guessMimeType(extension: string) {
  const normalized = extension.replace(/^\./, '').toLowerCase()
  const known: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    heic: 'image/heic',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    txt: 'text/plain',
    zip: 'application/zip',
    '7z': 'application/x-7z-compressed',
  }
  return known[normalized] ?? 'application/octet-stream'
}
