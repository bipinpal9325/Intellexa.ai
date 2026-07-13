import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 bg-[#0a0a12] pt-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 0%, rgba(108,92,231,0.08), transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 pb-10 border-b border-white/10">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="/">
            <img
              src={assets.logo1}
              alt="Intellexa.ai Logo"
              width={50}
              height={5}
              className="h-9 w-auto"
            />
          </a>
          <p className="text-sm/7 mt-6 text-slate-500 max-w-sm">
            Intellexa.ai — a connected suite of AI tools to help you write,
            design, and refine your content, without leaving one workspace.
          </p>
        </div>

        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-3">
            <h2 className="font-display text-white mb-2">Company</h2>
            <a className="hover:text-white transition-colors" href="#">About us</a>
            <a className="hover:text-white transition-colors flex items-center" href="#">
              Careers
              <span className="text-xs text-[#0a0a12] bg-[#9F91F0] rounded-md ml-2 px-2 py-0.5">Hiring</span>
            </a>
            <a className="hover:text-white transition-colors" href="#">Contact us</a>
            <a className="hover:text-white transition-colors" href="#">Privacy policy</a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-white mb-5">Stay in the loop</h2>
          <div className="text-sm space-y-5 max-w-sm">
            <p className="text-slate-500">
              Product notes and new tools, sent occasionally — never a flood.
            </p>
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/[0.03] border border-white/10">
              <input
                className="focus:outline-none w-full max-w-64 py-2 px-4 bg-transparent text-[#F1F0FA]
                placeholder:text-slate-500"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-[#6C5CE7] hover:bg-[#5B4BD6] px-5 py-2 text-white rounded-full
                text-sm font-medium transition-colors cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="relative py-6 text-center text-slate-500">
        © 2026 <a href="/" className="hover:text-white transition-colors">Intellexa.ai</a> — All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
