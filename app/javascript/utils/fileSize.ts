export function displayFileSize(fileSizeBytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = fileSizeBytes
  let unitIndex = 0

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}
