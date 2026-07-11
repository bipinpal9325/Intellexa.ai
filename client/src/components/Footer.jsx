import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-white/50 bg-ink pt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 pb-10 border-b border-white/10">
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
          <p className="text-sm/7 mt-6 text-white/40 max-w-sm">
            Intellexa.ai — a connected suite of AI tools to help you write,
            design, and refine your content, without leaving one workspace.
          </p>
        </div>

        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-3">
            <h2 className="font-display text-white mb-2">Company</h2>
            <a className="hover:text-white transition" href="#">About us</a>
            <a className="hover:text-white transition flex items-center" href="#">
              Careers
              <span className="text-xs text-ink bg-accent rounded-md ml-2 px-2 py-0.5">Hiring</span>
            </a>
            <a className="hover:text-white transition" href="#">Contact us</a>
            <a className="hover:text-white transition" href="#">Privacy policy</a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-white mb-5">Stay in the loop</h2>
          <div className="text-sm space-y-5 max-w-sm">
            <p className="text-white/40">
              Product notes and new tools, sent occasionally — never a flood.
            </p>
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10">
              <input
                className="focus:outline-none w-full max-w-64 py-2 px-4 bg-transparent text-white
                placeholder:text-white/30"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-primary px-5 py-2 text-white rounded-full text-sm font-medium
                hover:bg-primary-dim transition cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-white/30">
        © 2026 <a href="/" className="hover:text-white transition">Intellexa.ai</a> — All rights reserved.
      </p>
    </footer>
  )
}

export default Footer