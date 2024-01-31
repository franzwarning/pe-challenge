import * as React from 'react'
import { Toaster } from 'react-hot-toast'

export default function MainWrapper({ children }: React.PropsWithChildren) {
    return (
        <>
            {children}
            <Toaster />
        </>
    )
}
