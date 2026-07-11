import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <section className="px-4 sm:px-20 xl:px-32 py-28 bg-paper">
      <div className="max-w-xl mb-16">
        <p className="font-mono-label text-xs uppercase text-primary mb-4">The Suite</p>
        <h2 className="font-display text-4xl sm:text-[42px] text-slate-800 font-medium mb-4">
          Every tool, one connected workspace
        </h2>
        <p className="text-slate-soft text-base">
          Seven focused tools that share your context — no re-explaining, no
          switching platforms, no losing your place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AiToolsData.map((tool, index) => {
          const featured = index === 0
          return (
            <div
              key={index}
              onClick={() => user && navigate(tool.path)}
              className={`group p-8 rounded-2xl cursor-pointer transition-all duration-300 border
                ${featured
                  ? 'sm:col-span-2 bg-ink border-ink text-white'
                  : 'bg-white border-gray-100 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(91,79,233,0.35)]'
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 border
                  ${featured ? 'border-white/20 bg-white/10' : 'border-primary/15 bg-primary-light'}`}
              >
                <tool.Icon className={`w-5 h-5 ${featured ? 'text-accent' : 'text-primary'}`} />
              </div>
              <h3 className={`font-display text-xl mb-2 ${featured ? 'text-white' : 'text-slate-800'}`}>
                {tool.title}
              </h3>
              <p className={`text-sm leading-relaxed max-w-sm ${featured ? 'text-white/60' : 'text-slate-soft'}`}>
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