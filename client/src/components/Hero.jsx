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
    <section className="relative w-full min-h-screen bg-ink text-white overflow-hidden">
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
        .hero-rise { animation: heroRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .hero-rise-1 { animation-delay: 0.05s; }
        .hero-rise-2 { animation-delay: 0.15s; }
        .hero-rise-3 { animation-delay: 0.25s; }
        .hero-rise-4 { animation-delay: 0.35s; }
        .ring-in { animation: ringIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.3s; }
        .icon-float { animation: iconFloat 4.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise, .ring-in, .icon-float { animation: none !important; }
        }
      `}</style>

      {/* Ambient gradient wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 20%, rgba(91,79,233,0.35), transparent 60%), radial-gradient(45% 40% at 10% 85%, rgba(232,200,136,0.14), transparent 60%)',
        }}
      />
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 pt-36 pb-20 md:pt-40
        grid md:grid-cols-2 gap-16 items-center min-h-screen">

        {/* Left: thesis */}
        <div>
          <p className="hero-rise hero-rise-1 font-mono-label text-xs uppercase text-accent mb-6">
            Intellexa — AI Tool Suite
          </p>
          <h1 className="hero-rise hero-rise-2 font-display text-5xl sm:text-6xl leading-[1.05] font-medium mb-6">
            Work with the calm<br />
            precision of <span className="italic" style={{ color: '#B8B2F7' }}>AI</span>
          </h1>
          <p className="hero-rise hero-rise-3 text-white/60 text-lg max-w-md mb-10">
            Write, design, and refine your content with one connected suite of
            AI tools — built for people who want less friction, not more dashboards.
          </p>
          <div className="hero-rise hero-rise-4 flex flex-wrap items-center gap-6">
            <button
              onClick={() => navigate('/ai')}
              className="bg-primary hover:bg-primary-dim text-white px-8 py-3.5 rounded-full
              text-sm font-semibold transition active:scale-95 cursor-pointer"
            >
              Start building
            </button>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <img src={assets.user_group} alt="" className="h-7" />
              In active use by early teams
            </div>
          </div>
        </div>

        {/* Right: signature tool constellation */}
        <div className="ring-in relative hidden md:flex items-center justify-center h-[420px]">
          <div className="relative w-[380px] h-[380px]">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-10 rounded-full border border-white/10" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full bg-primary flex items-center justify-center
                font-display italic text-lg"
                style={{ boxShadow: '0 0 60px 10px rgba(91,79,233,0.5)' }}
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
                  className="icon-float w-11 h-11 rounded-full bg-white/10 backdrop-blur
                  border border-white/15 flex items-center justify-center"
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