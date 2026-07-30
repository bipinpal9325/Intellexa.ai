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

      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-white/10 bg-[#0a0a12] z-20">
        <button
          onClick={() => navigate('/')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60 rounded cursor-pointer"
          aria-label="Go to home page"
        >
          <img
            src={assets.logo1}
            alt="Intellexa logo"
            className="w-32 sm:w-44"
          />
        </button>

        <button
          onClick={() => setSidebar((prev) => !prev)}
          className="sm:hidden p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60"
          aria-label={sidebar ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebar}
        >
          {sidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* min-h-14 on the nav above = 56px, so subtract 56px here, not 64px,
          otherwise a stray gap/overflow shows up under the nav bar */}
      <div className="flex-1 w-full flex h-[calc(100vh-56px)] overflow-hidden relative">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-[#0a0a12] overflow-y-auto">
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

            // Clerk's colorText variable doesn't reach these sub-components,
            // so without explicit overrides they render as dark text on the
            // dark card (invisible/hard to read). Force them to match the theme.
            socialButtonsBlockButton: 'border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors',
            socialButtonsBlockButtonText: 'text-[#F1F0FA] font-medium',
            socialButtonsProviderIcon: 'brightness-110',

            dividerLine: 'bg-white/10',
            dividerText: 'text-slate-400',

            formFieldLabel: 'text-[#F1F0FA]',
            formFieldInput: 'bg-[#15151f] border-white/10 text-[#F1F0FA] placeholder:text-slate-500',
            formFieldInputShowPasswordButton: 'text-slate-400 hover:text-[#F1F0FA]',

            footerActionText: 'text-slate-400',
            footerActionLink: 'text-[#6C5CE7] hover:text-[#5B4BD6] font-medium',

            identityPreviewText: 'text-[#F1F0FA]',
            identityPreviewEditButton: 'text-[#6C5CE7] hover:text-[#5B4BD6]',
          },
        }}
      />
    </div>
  )
}

export default Layout