import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import * as React from 'react'
import toast from 'react-hot-toast'

import { IconFile } from '../../icons/File'
import { displayFileTypeForMimeType } from '../../utils/fileType'
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
  }
}) {
  const { file: serverFile } = props

  const [description, setDescription] = React.useState(serverFile.description)
  const [priceUsd, setPriceUsd] = React.useState(serverFile.price_usd)
  const fileNameRef = React.useRef<HTMLDivElement>(null)
  const fileNameContainerRef = React.useRef<HTMLDivElement>(null)

  const controls = useAnimationControls()
  /**
   *  Subscribe to updates in real time
   */
  React.useEffect(() => {
    let loadingToast: string | undefined
    if (!serverFile.description) {
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
        }
      )
      .subscribe(async (status, err) => {
        if (err) {
          toast.error('Error subscribing to file updates...')
          return
        } else {
          if (!serverFile.description) {
            const file = await supabaseClient
              .from('user_files')
              .select('description,display_image_url,price_usd')
              .eq('id', serverFile.id)
              .single()
            if (file.data.description || file.data.display_image_url) {
              setDescription(file.data.description)
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

  /**
   * Icon background color hash of file name
   */
  const iconBgColor = React.useMemo(() => {
    const possibleColors = ['#FFC900', '#FF90E8', '#90A8ED', '#23A094']
    const charCode = serverFile.file_name.charCodeAt(0)
    const colorIndex = charCode % possibleColors.length
    return possibleColors[colorIndex]
  }, [])

  /**
   * Extension to display
   */
  const displayExtension = React.useMemo(() => {
    if (!serverFile.extension || serverFile.extension === '') {
      return '???'
    } else {
      return serverFile.extension
    }
  }, [serverFile.extension])

  /**
   * File type to display
   */
  const displayFileType = React.useMemo(() => displayFileTypeForMimeType(serverFile.mime_type), [serverFile.mime_type])

  /**
   * Scroll file name if necessary
   */
  React.useEffect(() => {
    if (fileNameRef.current && fileNameContainerRef.current) {
      const fileNameRefWidth = fileNameRef.current.clientWidth
      const fileNameContainerRefWidth = fileNameContainerRef.current.clientWidth

      const translateX = -1 * Math.max(fileNameRefWidth - fileNameContainerRefWidth, 0)
      const duration = Math.abs(translateX) / 5
      controls.start({
        translateX: [0, translateX, 0],
        transition: {
          repeatDelay: 0.2,
          repeat: Infinity,
          duration,
          ease: 'linear'
        }
      })
    }
  }, [controls])

  return (
    <PageWrapper
      header={
        <div className="border-b w-full fixed z-30 backdrop-blur-3xl  border-black flex items-center justify-center h-12 sm:h-16 -mx-3 flex-none">
          <div className="w-full h-full max-w-page flex items-center justify-center relative">
            <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center">
              <a href="/" className="flex flex-row items-center justify-center  pl-1.5 pr-3 py-0.5 sm:py-1 gap-1 ">
                <ArrowLeftIcon className="h-3 w-3 sm:w-5 sm:h-5" />
                <div className="mt-0.5 text-sm sm:text-base">Gumdrop</div>
              </a>
            </div>
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
          className="w-full h-full pt-32"
        >
          <div className="w-full  flex flex-col md:flex-row gap-3 border-2 border-black ">
            <div
              className="relative flex-1 md:border-r-2 border-black flex items-center justify-center p-10"
              style={{ backgroundColor: iconBgColor }}
            >
              <IconFile className="w-32 md:w-64" extension={displayExtension} color={iconBgColor} />
            </div>
            <div className="flex-none md:w-96 flex flex-col p-10 gap-7 ">
              <div className="w-full overflow-hidden" ref={fileNameContainerRef}>
                <motion.div ref={fileNameRef} animate={controls} className="font-medium text-3xl w-fit">
                  {serverFile.file_name}
                </motion.div>
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
              <div className="border rounded-lg border-black flex flex-col  text-sm">
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="font-bold">File Type</div>
                  <div className="">{displayFileType}</div>
                </div>
                <div className="w-full h-[1px] bg-black" />
                <div className="flex items-center justify-between px-3 py-3 ">
                  <div className="font-bold">File Format</div>
                  <div className="uppercase">{displayExtension}</div>
                </div>
                <div className="w-full h-[1px] bg-black" />
                <div className="flex items-center justify-between px-3 py-3 ">
                  <div className="font-bold">File Size</div>
                  <div className="">12 MB</div>
                </div>
              </div>
              {priceUsd !== undefined && priceUsd !== null && (
                <button
                  className=" bg-black py-2 text-white "
                  onClick={() => {
                    toast.success("This isn't actually implemented :).")
                  }}
                >
                  Purchase for {`${priceUsd === 0 ? `Free` : `$${priceUsd}`}`}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
