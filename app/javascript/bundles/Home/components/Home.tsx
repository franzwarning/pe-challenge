import * as React from 'react'

import { DropArea } from './DropArea'

export default function HomePage() {
    return (
        <>
            <DropArea />
            <div className="text-black h-full w-full flex items-center justify-center relative z-10 pointer-events-none">
                GUMDROP
                <div className="w-10 h-10 bg-black"></div>
            </div>
        </>
    )
}
