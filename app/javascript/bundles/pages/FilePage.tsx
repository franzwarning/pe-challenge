import { ChevronLeftIcon } from '@heroicons/react/24/solid'
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
    file: { file_name, description }
  } = props

  return (
    <PageWrapper
      header={
        <div className="border-b w-full fixed z-30 backdrop-blur-3xl bg-white/70 border-black flex items-center justify-center h-16 -mx-3 flex-00auto">
          <div className="w-full h-full max-w-page flex items-center justify-center relative">
            <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center">
              <a
                href="/"
                className="flex flex-row items-center justify-center border border-black pl-1.5 pr-3 py-1 gap-1 hover:bg-black/10"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <div className="mt-0.5">Gumdrop</div>
              </a>
            </div>
            <div className="text-2xl">{file_name}</div>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex pt-16">
        <div>
          <div className="relative aspect-video">
            <img src="https://placehold.it/1200x630" className="object-cover w-full h-full" />
          </div>

          <div>{description}</div>
        </div>
      </div>
    </PageWrapper>
  )
}
