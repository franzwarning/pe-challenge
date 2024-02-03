import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import toast from 'react-hot-toast'

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
    let loadingToast: string | undefined
    if (!serverFile.description && !serverFile.display_image_url) {
      loadingToast = toast.loading('Generating details for file...')
    }

    const channel = supabaseClient
      .channel('file_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_files', filter: `id=eq.${serverFile.id}` },
        (payload) => {
          loadingToast && toast.dismiss(loadingToast)
          setDescription(payload.new.description)
          setPriceUsd(payload.new.price_usd)
          setImageUrl(payload.new.display_image_url)
        }
      )
      .subscribe(async (status, err) => {
        if (err) {
          toast.error('Error subscribing to file updates...')
          return
        } else {
          if (!serverFile.description && !serverFile.display_image_url) {
            const file = await supabaseClient
              .from('user_files')
              .select('description,display_image_url,price_usd')
              .eq('id', serverFile.id)
              .single()
            if (file.data.description || file.data.display_image_url) {
              setDescription(file.data.description)
              setImageUrl(file.data.display_image_url)
              setPriceUsd(file.data.price_usd)
              loadingToast && toast.dismiss(loadingToast)
            }
          }
        }
      })
    return () => {
      channel.unsubscribe()
    }
  }, [serverFile])

  return (
    <PageWrapper
      header={
        <div className="border-b w-full fixed z-30 backdrop-blur-3xl bg-white/70 border-black flex items-center justify-center h-12 sm:h-16 -mx-3 flex-00auto">
          <div className="w-full h-full max-w-page flex items-center justify-center relative">
            <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center">
              <a
                href="/"
                className="flex flex-row items-center justify-center border border-black pl-1.5 pr-3 py-0.5 sm:py-1 gap-1 hover:bg-black/10"
              >
                <ChevronLeftIcon className="h-3 w-3 sm:w-5 sm:h-5" />
                <div className="mt-0.5 text-sm sm:text-base">Gumdrop</div>
              </a>
            </div>
            <div className="text-md sm:text-2xl max-w-36 sm:max-w-64 md:max-w-96 truncate ">{serverFile.file_name}</div>
          </div>
        </div>
      }
    >
      <AnimatePresence initial={!serverFile.description}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          key={'main-content'}
          className="w-full h-full pt-20"
        >
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="relative aspect-square w-full sm:w-64 sm:h-64 flex-00auto bg-gray-100 rounded-md overflow-hidden border">
              {imageUrl ? (
                <img src={imageUrl} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full animate-pulse bg-gray-300"></div>
              )}
              {priceUsd !== undefined && priceUsd !== null && (
                <button
                  className="absolute bottom-3 left-3 right-3 px-3 py-1 bg-black text-white font-medium shadow-xl"
                  onClick={() => {
                    toast.success("This isn't actually implemented :).")
                  }}
                >
                  Purchase for {`${priceUsd === 0 ? `Free` : `$${priceUsd}`}`}
                </button>
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
          <div className="mt-10"></div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
