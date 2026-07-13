import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { SquarePen, Hash, Image as ImageIcon, Eraser, Scissors, FileText } from 'lucide-react'

// Mirrors the actual tool set from Sidebar.jsx — the ring is grounded in the
// real product, not a decorative stock graphic.
const orbitIcons = [
  { Icon: SquarePen, angle: 0 },
  { Icon: Hash, angle: 60 },
  { Icon: ImageIcon, angle: 120 },
  { Icon: Eraser, angle: 180 },
  { Icon: Scissors, angle: 240 },
  { Icon: FileText, angle: 300 },
]

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glowDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-3%, 2%); }
        }
        .hero-rise { animation: heroRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .hero-rise-1 { animation-delay: 0.05s; }
        .hero-rise-2 { animation-delay: 0.15s; }
        .hero-rise-3 { animation-delay: 0.25s; }
        .hero-rise-4 { animation-delay: 0.35s; }
        .ring-in { animation: ringIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.3s; }
        .icon-float { animation: iconFloat 4.5s ease-in-out infinite; }
        .glow-drift { animation: glowDrift 26s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise, .ring-in, .icon-float, .glow-drift { animation: none !important; }
        }
      `}</style>

      {/* Single off-axis violet glow source, top-right */}
      <div
        className="glow-drift pointer-events-none absolute -top-32 right-[-10%] w-[700px] h-[700px] rounded-full opacity-30 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* Fade guard so the glow never overpowers text contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(to bottom, transparent, #0a0a12 90%)' }}
        aria-hidden="true"
      />
      {/* Subtle hero-only texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 pt-36 pb-20 md:pt-40
        grid md:grid-cols-2 gap-16 items-center min-h-screen">

        {/* Left: thesis */}
        <div>
          <p className="hero-rise hero-rise-1 font-mono-label text-xs uppercase tracking-[0.2em] text-[#9F91F0] mb-6">
            Intellexa — AI Tool Suite
          </p>
          <h1 className="hero-rise hero-rise-2 font-display text-5xl sm:text-6xl leading-[1.05] text-white font-medium mb-6">
            Work with the calm<br />
            precision of <span className="italic text-[#9F91F0]">AI</span>
          </h1>
          <p className="hero-rise hero-rise-3 text-slate-400 text-lg max-w-md mb-10">
            Write, design, and refine your content with one connected suite of
            AI tools — built for people who want less friction, not more dashboards.
          </p>
          <div className="hero-rise hero-rise-4 flex flex-wrap items-center gap-6">
            <button
              onClick={() => navigate('/ai')}
              className="bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white px-8 py-3.5 rounded-full
              text-sm font-medium transition-colors active:scale-95 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60"
            >
              Start building
            </button>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <img src={assets.user_group} alt="" className="h-7" />
              In active use by early teams
            </div>
          </div>
        </div>

        {/* Right: signature tool constellation */}
        <div className="ring-in relative hidden md:flex items-center justify-center h-[420px]">
          <div className="relative w-[380px] h-[380px]">
            <div className="absolute inset-0 rounded-full border border-white/10" aria-hidden="true" />
            <div className="absolute inset-10 rounded-full border border-white/10" aria-hidden="true" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full bg-[#6C5CE7] flex items-center justify-center
                font-display italic text-lg text-white"
                style={{ boxShadow: '0 0 60px 10px rgba(108,92,231,0.5)' }}
              >
                AI
              </div>
            </div>

            {orbitIcons.map(({ Icon, angle }, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-11 h-11"
                style={{
                  transform: `rotate(${angle}deg) translate(170px) rotate(-${angle}deg)`,
                  marginTop: '-22px',
                  marginLeft: '-22px',
                }}
              >
                <div
                  className="icon-float w-11 h-11 rounded-full bg-white/[0.05] backdrop-blur-sm
                  border border-white/10 flex items-center justify-center"
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  <Icon className="w-4.5 h-4.5 text-white/80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
