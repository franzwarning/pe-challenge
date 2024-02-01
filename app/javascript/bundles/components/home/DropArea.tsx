import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { animate, AnimatePresence, easeInOut, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import debounce from 'lodash.debounce'
import * as React from 'react'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { uploadFile } from '../../../api/api'
import { GumroadGuy } from '../../../icons/GumroadGuy'

export function DropArea(props: { className: string }) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploaded, setUploaded] = React.useState(false)
  const [dropIconVisible, setDropIconVisible] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const uploadProgressPercent = useMotionValue(0)
  const widthTransform = useTransform(uploadProgressPercent, [0, 100], ['0%', '100%'], { ease: easeInOut })
  const xValue = useMotionValue(0)
  const xSpring = useSpring(xValue, { bounce: 0.3 })
  const yValue = useMotionValue(0)
  const ySpring = useSpring(yValue, { bounce: 0.3 })

  const setMotionValues = React.useCallback((x: number, y: number) => {
    if (xValue.get() !== x || yValue.get() !== y) {
      xValue.set(x)
      yValue.set(y)
    }
  }, [])
  const debouncedSetFn = React.useMemo(
    () => debounce(setMotionValues, 100, { maxWait: 100, leading: true, trailing: true }),
    []
  )

  const startUpload = React.useCallback(async (file: File) => {
    setIsUploading(true)
    animate(uploadProgressPercent, 10)
    const fileId = await uploadFile(file, (progressPercent) => {
      console.log(`setting progress percent: ${progressPercent}`)
      animate(uploadProgressPercent, progressPercent)
    })
    setUploaded(true)
    setTimeout(() => {
      window.location.href = `/files/${fileId}`
    }, 2000)
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('drag enter')
          setDropIconVisible(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()

          debouncedSetFn(e.clientX, e.clientY)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('drag leave')
          setDropIconVisible(false)
        }}
        onDrop={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('drop')
          const dt = e.dataTransfer
          const files = dt.files

          /**
           * Some error handling
           */
          if (files.length > 1) {
            toast.error('Only one file at a time. Use a zip file to upload multiple files.')
            setDropIconVisible(false)
            return
          } else if (dt.items.length && dt.items[0].webkitGetAsEntry()?.isDirectory) {
            toast.error('Cannot upload a directory. Use a zip file to upload multiple files.')
            setDropIconVisible(false)
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
        }}
      />
      <div
        className={twMerge(
          'border border-dashed border-black rounded flex flex-col bg-white relative items-center justify-center overflow-hidden',
          props.className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {uploaded ? (
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
          <GumroadGuy />
        </motion.div>
        <motion.div
          className="absolute top-0 bottom-0 left-0 bg-[#ff91e7]/30"
          style={{ width: widthTransform }}
        ></motion.div>
        <AnimatePresence>
          {dropIconVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-20 h-20 bg-gray-200 border-gray-400 rounded-xl border touch-none select-none pointer-events-none"
              style={{
                x: xSpring,
                y: ySpring,
                translateX: '-50%',
                translateY: '-50%'
              }}
            >
              <div>{`%${uploadProgressPercent}`}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
