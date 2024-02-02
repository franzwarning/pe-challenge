import * as React from 'react'

import { DropArea } from '../components/home/DropArea'
import PageWrapper from '../global/PageWrapper'

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="text-black h-full w-full flex items-start relative z-10 flex-col gap-10 pt-12 sm:pt-24">
        <div className="text-4xl font-medium">Welcome to Gumdrop.</div>
        <div className="text-xl max-w-paragraph w-full self-stretch">
          Gumdrop is the easiest way to list your product on Gumroad. Simply drag and drop a file into the area below
          and let Gumdrop do the rest!
        </div>
        <DropArea className="w-full min-h-[489px]" />
        <div className="flex-1" />
        <div className="text-sm self-center mb-3">
          <a href="https://github.com/franzwarning/pe-challenge" target="__blank" className="underline">
            Engineering by Raymond Kennedy.
          </a>{' '}
          <a href="https://mattportner.com" className="underline" target="__blank">
            Design by Matthew Portner.
          </a>
        </div>
      </div>
    </PageWrapper>
  )
}
