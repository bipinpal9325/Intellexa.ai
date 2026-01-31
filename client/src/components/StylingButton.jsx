import React from 'react'

const StylingButton = () => {
  return (
 
            <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
                <button onClick={openSignIn} className="px-8 text-sm py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
                    Log In
                </button>
            </div>
  )
}

export default StylingButton
