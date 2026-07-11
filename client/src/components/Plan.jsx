import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

const Plan = () => {
  return (
    <section className="bg-paper py-28 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono-label text-xs uppercase text-primary mb-4">Pricing</p>
          <h2 className="font-display text-4xl sm:text-[42px] text-slate-800 font-medium mb-4">
            Choose your plan
          </h2>
          <p className="text-slate-soft max-w-lg mx-auto">
            Start free to explore the core tools, or upgrade for advanced
            features, priority support, and a fully connected AI workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-2 sm:p-6
          shadow-[0_30px_60px_-30px_rgba(11,14,26,0.15)] max-sm:mx-4">
          <PricingTable />
        </div>
      </div>
    </section>
  )
}

export default Plan