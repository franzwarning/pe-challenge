import * as React from 'react'
import { Toaster } from 'react-hot-toast'

export default function MainWrapper({ children }: React.PropsWithChildren) {
  return (
    <div className="w-full h-full flex justify-center px-3 ">
      <div className="max-w-page w-full h-full">{children}</div>
      <Toaster />
    </div>
  )
}
