import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <section className="relative px-4 sm:px-20 xl:px-32 py-28 bg-[#0a0a12] overflow-hidden">
      {/* Single off-axis glow, centered-top this time */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(to bottom, transparent, #0a0a12 90%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-xl mb-16">
        <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#9F91F0] mb-4">
          The Suite
        </p>
        <h2 className="font-display text-4xl sm:text-[42px] text-white font-medium mb-4">
          Every tool, one connected <span className="italic text-[#9F91F0]">workspace</span>
        </h2>
        <p className="text-slate-400 text-base">
          Seven focused tools that share your context — no re-explaining, no
          switching platforms, no losing your place.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AiToolsData.map((tool, index) => {
          const featured = index === 0
          return (
            <div
              key={index}
              onClick={() => user && navigate(tool.path)}
              className={`group p-8 rounded-2xl cursor-pointer transition-colors duration-200 border backdrop-blur-sm
                ${featured
                  ? 'sm:col-span-2 bg-white/[0.04] border-[#6C5CE7]/40 shadow-[0_0_60px_-15px_rgba(108,92,231,0.35)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-[#6C5CE7]/50'
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 border
                  ${featured ? 'border-[#6C5CE7]/30 bg-[#6C5CE7]/10' : 'border-white/10 bg-white/[0.05]'}`}
              >
                <tool.Icon className={`w-5 h-5 ${featured ? 'text-[#9F91F0]' : 'text-[#9F91F0]'}`} />
              </div>
              <h3 className="font-display text-xl mb-2 text-white">
                {tool.title}
              </h3>
              <p className="text-sm leading-relaxed max-w-sm text-slate-400">
                {tool.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default AiTools
