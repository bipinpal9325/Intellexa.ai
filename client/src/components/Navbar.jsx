import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <div className="fixed z-20 w-full flex justify-between items-center py-4
      px-4 sm:px-20 xl:px-32 bg-ink/60 backdrop-blur-xl border-b border-white/5">
      {/*
        NOTE: this navbar now sits on a dark (--color-ink) background.
        If your logo1 asset is a dark/colored mark designed for a light
        background, it may need a light variant here for contrast —
        swap in a white/light version of the logo if you have one.
      */}
      <img
        src={assets.logo1}
        alt="logo1"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer
          bg-white text-ink px-8 py-2.5 font-medium hover:bg-white/90 transition"
        >
          Log In
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar