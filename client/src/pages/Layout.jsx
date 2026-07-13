import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen bg-[#0a0a12]">

      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-white/10 bg-[#0a0a12]">
        <img
          src={assets.logo1}
          alt="logo"
          className="w-32 sm:w-44 cursor-pointer"
          onClick={() => navigate('/')}
        />
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-slate-400 hover:text-white transition-colors sm:hidden cursor-pointer"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-slate-400 hover:text-white transition-colors sm:hidden cursor-pointer"
          />
        )}
      </nav>

      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-[#0a0a12] overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='relative flex items-center justify-center h-screen bg-[#0a0a12] overflow-hidden'>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-30 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <SignIn
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
          elements: {
            card: 'bg-white/[0.03] border border-white/10 backdrop-blur-sm shadow-[0_0_60px_-15px_rgba(108,92,231,0.35)]',
            formButtonPrimary: 'bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white shadow-none normal-case',
          },
        }}
      />
    </div>
  )
}

export default Layout
