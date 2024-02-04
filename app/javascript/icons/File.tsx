import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export function IconFile({ extension, className, color }: { extension: string; className: string; color: string }) {
  return (
    <div className={twMerge('aspect-[250/334] relative', className)}>
      <svg width="100%" height="100%" viewBox="0 0 250 334" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M145.833 88.5417V0H15.625C6.96615 0 0 6.96615 0 15.625V317.708C0 326.367 6.96615 333.333 15.625 333.333H234.375C243.034 333.333 250 326.367 250 317.708V104.167H161.458C152.865 104.167 145.833 97.1354 145.833 88.5417ZM250 79.362V83.3333H166.667V0H170.638C174.805 0 178.776 1.6276 181.706 4.55729L245.443 68.3594C248.372 71.2891 250 75.2604 250 79.362Z"
          fill="black"
          fillOpacity="0.5"
        />
      </svg>
      <div
        className="absolute left-0 right-0 bottom-4 md:bottom-10 text-center text-3xl md:text-7xl font-bold lowercase font-sans"
        style={{ color }}
      >
        {extension}
      </div>
    </div>
  )
}
