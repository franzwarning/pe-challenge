import { v4 } from 'uuid'

import { LocalStorageKeys } from '../utils/localStorage'

function getDefaultHeaders() {
  let anonymousUserId = localStorage.getItem(LocalStorageKeys.AnonymousUserId)
  if (!anonymousUserId) {
    anonymousUserId = v4()
    localStorage.setItem(LocalStorageKeys.AnonymousUserId, anonymousUserId)
  }

  return {
    'Content-Type': 'application/json',
    'X-Anonymous-User-Id': anonymousUserId,
    'X-Supabase-Api-Key': process.env.SUPABASE_ANON_PUBLIC_KEY
  }
}

async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      ...getDefaultHeaders(),
      ...(options.headers || {})
    },
    ...options
  })
  const json = await response.json()
  return json
}

interface GeneratePresignedUrlResponse {
  url: string
}

export async function uploadFile(file: File) {
  // get presigned url
  const { url: presignedUploadUrl } = await makeRequest<GeneratePresignedUrlResponse>('/api/v1/files/presigned_url', {
    method: 'POST'
  })

  // upload file to presigned url
  await fetch(`${process.env.SUPABASE_URL}/storage/v1${presignedUploadUrl}`, {
    method: 'PUT',
    body: file,
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ANON_PUBLIC_KEY}`
    }
  })

  debugger
}
