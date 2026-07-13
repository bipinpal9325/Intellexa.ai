import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

const Plan = () => {
  return (
    <section className="relative bg-[#0a0a12] py-28 px-4 overflow-hidden">
      {/* Ambient purple glow, echoes the hero */}
      <div
        className="pointer-events-none absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent, #0a0a12 90%), radial-gradient(circle at 50% 0%, rgba(108,92,231,0.08), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#9F91F0] mb-4">
            Pricing
          </p>
          <h2 className="font-display text-4xl sm:text-[42px] text-white font-medium mb-4">
            Choose your <span className="italic text-[#9F91F0]">plan</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Start free to explore the core tools, or upgrade for advanced
            features, priority support, and a fully connected AI workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2 sm:p-4 shadow-[0_0_60px_-15px_rgba(108,92,231,0.35)]">
          <PricingTable
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#6C5CE7',
                colorBackground: '#0f0f1a',
                colorText: '#F1F0FA',
                colorTextSecondary: '#9CA3AF',
                colorInputBackground: '#15151f',
                colorInputText: '#F1F0FA',
                colorNeutral: '#FFFFFF',
                borderRadius: '0.75rem',
                fontFamily: 'inherit',
              },
              elements: {
                card: 'bg-transparent shadow-none border-0',
                pricingTableCard:
                  'bg-white/[0.04] border border-white/10 hover:border-[#6C5CE7]/50 transition-colors',
                pricingTableCardHeader: 'border-b border-white/10',
                pricingTableCardTitle: 'text-white font-display',
                pricingTableCardDescription: 'text-slate-400',
                pricingTableCardFee: 'text-white',
                pricingTableCardFeeFrequency: 'text-slate-400',
                pricingTableCardFeatures: 'text-slate-300',
                formButtonPrimary:
                  'bg-[#6C5CE7] hover:bg-[#5B4BD6] text-white shadow-none normal-case focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60',
                badge: 'bg-[#6C5CE7]/20 text-[#9F91F0] border border-[#6C5CE7]/30',
              },
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default Plan
