import axios from 'axios'
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
  id: number
  presigned_upload_url: string
  bucket_path: string
  file_name: string
  mime_type: string
}

export async function uploadFile(file: File, progressCallback: (progressPercent) => void) {
  // get presigned url
  const presignedUrlResponse = await makeRequest<GeneratePresignedUrlResponse>('/api/v1/files/presigned_url', {
    method: 'POST',
    body: JSON.stringify({
      file_name: file.name,
      mime_type: file.type
    })
  })

  await axios.request({
    method: 'put',
    url: `${process.env.SUPABASE_URL}/storage/v1${presignedUrlResponse.presigned_upload_url}`,
    data: file,
    onUploadProgress: (p) => {
      console.log(p)
      progressCallback((p.loaded / p.total) * 100)
    },
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ANON_PUBLIC_KEY}`
    }
  })

  // upload file to presigned url
  // await fetch(`${process.env.SUPABASE_URL}/storage/v1${presignedUrlResponse.presigned_upload_url}`, {
  //   method: 'PUT',
  //   body: file,
  //   headers: {
  //     Authorization: `Bearer ${process.env.SUPABASE_ANON_PUBLIC_KEY}`
  //   }
  // })

  console.log(`uploaded....`)

  // window.location.href = `/files/${presignedUrlResponse.id}`
  // create file on the database
}
