import * as React from 'react'
import { Toaster } from 'react-hot-toast'

export default function MainWrapper({
  children,
  header = null
}: React.PropsWithChildren<{ header?: React.ReactNode }>) {
  return (
    <div className="w-full h-full flex items-center flex-col">
      {header}
      <div className="max-w-page w-full px-3">{children}</div>
      <div className="flex-1" />
      <div className="flex-none text-sm items-center mb-3 mt-10 flex flex-col sm:flex-row justify-center sm:gap-1">
        <a href="https://github.com/franzwarning/pe-challenge" target="__blank" className="underline">
          Engineering by Raymond Kennedy.
        </a>{' '}
        <a
          href="https://www.figma.com/file/L0FobE6q2hbvM6Lx3zAyVy/Gumdrop?type=design&node-id=0-1&mode=design&t=WHNKRxgMmGdeJntd-0"
          className="underline"
          target="__blank"
        >
          Design by Matthew Portner.
        </a>
        <div className="sm:hidden h-2" />
      </div>
      <Toaster position="bottom-center" />
    </div>
  )
}
