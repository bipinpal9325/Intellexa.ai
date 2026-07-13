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
      px-4 sm:px-20 xl:px-32 bg-[#0a0a12]/60 backdrop-blur-xl border-b border-white/10">
      {/*
        NOTE: this navbar sits on bg-base (#0a0a12).
        If your logo1 asset is a dark/colored mark designed for a light
        background, swap in a light variant here for contrast.
      */}
      <img
        src={assets.logo1}
        alt="logo1"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {user ? (
        <UserButton
          appearance={{
            variables: {
              colorPrimary: '#6C5CE7',
              colorBackground: '#0f0f1a',
              colorText: '#F1F0FA',
              colorTextSecondary: '#9CA3AF',
              colorInputBackground: '#15151f',
              colorInputText: '#F1F0FA',
              borderRadius: '0.75rem',
            },
          }}
        />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer
          bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white px-8 py-2.5 font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60"
        >
          Log In
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar
