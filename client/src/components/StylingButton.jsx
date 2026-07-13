import React from 'react'
import { useClerk } from '@clerk/clerk-react'

const StylingButton = () => {
  const { openSignIn } = useClerk()

  return (
    <button
      onClick={openSignIn}
      className="px-8 py-3 text-sm text-white rounded-full font-medium cursor-pointer
      border border-white/15 bg-white/[0.03] backdrop-blur-sm
      hover:border-[#6C5CE7]/50 hover:shadow-[0_0_40px_-12px_rgba(108,92,231,0.45)]
      transition-colors duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60"
    >
      Log In
    </button>
  )
}

export default StylingButton
