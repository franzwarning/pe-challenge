import * as React from 'react'
import { Toaster } from 'react-hot-toast'

export default function MainWrapper({
  children,
  header = null
}: React.PropsWithChildren<{ header?: React.ReactNode }>) {
  return (
    <div className="w-full h-full flex items-center flex-col">
      {header}
      <div className="max-w-page w-full h-full px-3">{children}</div>
      <Toaster />
    </div>
  )
}
