export function displayFileTypeForMimeType(mimeType: string) {
  if (mimeType.includes('image')) {
    return 'Image'
  } else if (mimeType.includes('video')) {
    return 'Video'
  } else if (mimeType.includes('audio')) {
    return 'Audio'
  } else if (mimeType.includes('pdf')) {
    return 'PDF'
  } else if (mimeType.includes('text')) {
    return 'Text'
  } else if (mimeType.includes('font')) {
    return 'Font'
  } else {
    return 'Unknown'
  }
}
