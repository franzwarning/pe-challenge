import axios from 'axios'

function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json',
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
  const startUploadFileTimestamp = new Date().getTime()

  // get presigned url
  const presignedUrlResponse = await makeRequest<GeneratePresignedUrlResponse>('/api/v1/files/presigned_url', {
    method: 'POST',
    body: JSON.stringify({
      file_name: file.name,
      mime_type: file.type
    })
  })

  // upload file
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

  // make sure it's been at least 1.5 seconds for the animation
  const now = new Date().getTime()
  if (now - startUploadFileTimestamp < 1500) {
    await new Promise((resolve) => setTimeout(resolve, 1500 - (now - startUploadFileTimestamp)))
  }

  return presignedUrlResponse.id
}
