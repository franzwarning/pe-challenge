import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import * as React from 'react'

import { supabaseClient } from '../../utils/supabaseClient'
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
    extension: string
    display_image_url: string
  }
}) {
  const { file: serverFile } = props

  const [imageUrl, setImageUrl] = React.useState(serverFile.display_image_url)
  const [description, setDescription] = React.useState(serverFile.description)
  const [priceUsd, setPriceUsd] = React.useState(serverFile.price_usd)

  /**
   *  Subscribe to updates in real time
   */
  React.useEffect(() => {
    const channel = supabaseClient
      .channel('file_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_files', filter: `id=eq.${serverFile.id}` },
        (payload) => {
          setDescription(payload.new.description)
          setPriceUsd(payload.new.price_usd)
          setImageUrl(payload.new.display_image_url)
        }
      )
      .subscribe((status, err) => { })
    return () => {
      channel.unsubscribe()
    }
  }, [])

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
            <div className="text-2xl max-w-36 sm:max-w-64 md:max-w-96 truncate">{serverFile.file_name}</div>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex pt-20 gap-3 flex-col sm:flex-row">
        <div className="relative aspect-square w-full sm:w-40 sm:h-40 flex-00auto bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full animate-pulse bg-gray-300"></div>
          )}
        </div>
        <div className="">
          {description ? (
            <div>{description}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_skeleton, idx) => (
                <div key={`description-skeleton-${idx}`} className="w-64 h-5 bg-gray-300 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
