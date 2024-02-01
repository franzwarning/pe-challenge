import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import debounce from 'lodash.debounce'
import * as React from 'react'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { uploadFile } from '../../../api/api'
import { GumroadGuy } from '../../../icons/GumroadGuy'

export function DropArea(props: { className: string }) {
  const [dropIconVisible, setDropIconVisible] = React.useState(false)
  const [uploadProgressPercent, setUploadProgressPercent] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

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

  const startUpload = React.useCallback(
    async (file: File) => {
      const success = await uploadFile(file, (progressPercent) => {
        console.log(`setting progress percent: ${progressPercent}`)
        setUploadProgressPercent(progressPercent)
      })
    },
    [setUploadProgressPercent]
  )

  return (
    <div
      className={twMerge(
        'border border-dashed border-black rounded flex flex-col bg-white relative items-center justify-center',
        props.className
      )}
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
    >
      <div className="flex flex-col items-center justify-center text-2xl gap-2 relative z-10">
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
        <input ref={inputRef} type="file" id="file" hidden />
      </div>
      <div className="absolute bottom-0 lg:right-20 md:right-10 sm:right-2 z-0">
        <GumroadGuy />
      </div>
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
  )
}
