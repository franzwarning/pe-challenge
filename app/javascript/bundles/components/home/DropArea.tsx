import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { animate, AnimatePresence, easeInOut, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import debounce from 'lodash.debounce'
import * as React from 'react'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { uploadFile } from '../../../api/api'
import { IconGumroadGuy } from '../../../icons/GumroadGuy'

export function DropArea(props: { className: string }) {
  /**
   * States
   */
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setUploaded] = React.useState(false)
  const [showDropzone, setShowDropzone] = React.useState(false)

  /**
   * Refs
   */
  const dropzoneRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  /**
   * Animation values + setters
   */
  const uploadProgressPercent = useMotionValue(0)
  const widthTransform = useTransform(uploadProgressPercent, [0, 100], ['0%', '100%'], { ease: easeInOut })
  const xValue = useMotionValue(0)
  const xSpring = useSpring(xValue, { bounce: 0.3 })
  const yValue = useMotionValue(0)
  const ySpring = useSpring(yValue, { bounce: 0.3 })
  const setMotionValues = React.useCallback((clientX: number, clientY: number) => {
    const dropzoneRect = dropzoneRef.current!.getBoundingClientRect()

    const x = clientX - dropzoneRect.left
    const y = clientY - dropzoneRect.top

    if (xValue.get() !== x || yValue.get() !== y) {
      xValue.set(x)
      yValue.set(y)
    }
  }, [])
  const debouncedSetFn = React.useMemo(
    () => debounce(setMotionValues, 100, { maxWait: 100, leading: true, trailing: true }),
    []
  )

  /**
   * Drag event listeners
   */
  React.useEffect(() => {
    function windowDragEnter() {
      console.log(`windowDragEnter`)
      setShowDropzone(true)
    }

    window.addEventListener('dragenter', windowDragEnter)

    return () => {
      window.removeEventListener('dragenter', windowDragEnter)
    }
  }, [])

  /**
   * Upload function (called from clicking input or dropping a file)
   */
  const startUpload = React.useCallback(async (file: File) => {
    setIsUploading(true)
    animate(uploadProgressPercent, 10)
    try {
      const fileId = await uploadFile(file, (progressPercent) => {
        console.log(`setting progress percent: ${progressPercent}`)
        animate(uploadProgressPercent, progressPercent)
      })
      setUploaded(true)
      setTimeout(() => {
        window.location.href = `/files/${fileId}`
      }, 2000)
    } catch (error) {
      toast.error(error.message || 'Something went wrong, please try again later!')
      setIsUploading(false)
      animate(uploadProgressPercent, 0)
    }
  }, [])

  return (
    <>
      {showDropzone && (
        <div
          className="fixed inset-0 z-40"
          onDragEnter={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            debouncedSetFn(e.clientX, e.clientY)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowDropzone(false)
          }}
          onDrop={async (e) => {
            e.preventDefault()
            e.stopPropagation()

            const dropzoneRect = dropzoneRef.current.getBoundingClientRect()

            /**
             * Make sure they dropped within the bounds
             */
            if (
              e.clientX < dropzoneRect.left ||
              e.clientX > dropzoneRect.left + dropzoneRect.width ||
              e.clientY < dropzoneRect.top ||
              e.clientY > dropzoneRect.top + dropzoneRect.height
            ) {
              console.log('outside')
              setShowDropzone(false)
              return
            }

            console.log('drop')
            const dt = e.dataTransfer
            const files = dt.files

            /**
             * Some error handling
             */
            if (files.length > 1) {
              toast.error('Only one file at a time. Use a zip file to upload multiple files.')
              return
            } else if (dt.items.length && dt.items[0].webkitGetAsEntry()?.isDirectory) {
              toast.error('Cannot upload a directory. Use a zip file to upload multiple files.')
              return
            }
            let fileToUpload: File | null = null
            if (files.length === 1) {
              fileToUpload = files[0]
            } else if (dt.items.length === 1) {
              fileToUpload = dt.items[0].getAsFile()
              if (!fileToUpload) {
                fileToUpload = await new Promise((res) => {
                  dt.items[0].getAsString((e) => {
                    res(new File([e], 'file.txt', { type: 'text/plain' }))
                  })
                })
              }
            }

            startUpload(fileToUpload)
            setShowDropzone(false)
          }}
        />
      )}

      {/* Dropzone black transparent backdrop */}
      <AnimatePresence>
        {showDropzone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={'isDroppingBackdrop'}
            className="bg-black/30 fixed inset-0 z-20 pointer-events-none"
          ></motion.div>
        )}
      </AnimatePresence>

      <div
        className={twMerge(
          `z-30 border ${showDropzone ? `border-solid` : `border-dashed`}  border-black rounded flex flex-col bg-white relative items-center justify-center overflow-hidden`,
          props.className
        )}
        ref={dropzoneRef}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isUploaded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={'uploaded'}
              className="text-2xl z-20 flex items-center justify-center gap-3"
            >
              <div>Uploaded</div>
              <CheckCircleIcon className="w-8 h-8" />
            </motion.div>
          ) : isUploading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={'uploading'}
              className="text-2xl z-20"
            >
              Uploading File...
            </motion.div>
          ) : (
            <motion.div
              key={'not-uploading'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-2xl gap-2 relative z-20"
            >
              <div className="">Drag and drop here</div>
              <div>or</div>
              <button
                className="bg-black text-white px-12 py-1 focus:ring-2 ring-black ring-offset-1 outline-none"
                onClick={() => {
                  inputRef.current!.click()
                }}
              >
                Select a file
              </button>
              <input
                ref={inputRef}
                type="file"
                id="file"
                hidden
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const file = e.target.files![0]
                  startUpload(file)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={`absolute bottom-0 lg:right-20 md:right-10 sm:right-2 z-10 transition-transform ${isUploading ? `translate-y-full` : ``}`}
          key={'gumroad-guy'}
        >
          <IconGumroadGuy />
        </motion.div>
        <motion.div
          className="absolute top-0 bottom-0 left-0 bg-[#ff91e7]/30"
          style={{ width: widthTransform }}
        ></motion.div>
        <AnimatePresence>
          {showDropzone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-20 h-20  border-gray-200 border-4 rounded-xl  touch-none select-none pointer-events-none top-0 left-0 flex items-center justify-center"
              style={{
                x: xSpring,
                y: ySpring,
                translateX: '-50%',
                translateY: '-50%'
              }}
            >
              <PlusCircleIcon className="w-10 h-10 text-gray-200" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
