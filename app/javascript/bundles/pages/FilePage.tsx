import * as React from 'react'

import PageWrapper from '../global/PageWrapper'

export default function FilePage(props: {
  file: {
    id: number
    file_name: string
    bucket_path: string
    created_at: string
    updated_at: string
    anonymous_users_id: number
    mime_type: string
    uploaded: boolean
    presigned_upload_url: string
    description: string | null
    price_usd: number | null
  }
}) {
  const {
    file: { file_name }
  } = props
  console.log(`props: `, props)
  return (
    <PageWrapper>
      <div className="w-full h-full flex flex-col gap-3">
        <div className="text-4xl">{file_name}</div>
        {JSON.stringify(props)}
      </div>
    </PageWrapper>
  )
}
