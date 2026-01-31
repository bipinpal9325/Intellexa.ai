import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>

        <div className='text-center' >
           <h1 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan for Subscription</h1>

           <p  className='text-gray-500 max-w-lg mx-auto'> Pick the plan that’s right for you.  
        Start with the free plan to explore essential tools,  
        or upgrade to premium for advanced features, priority support,  
        and an enhanced AI experience.</p>
        </div>

        <div className='mt-14 max-sm:mx-8 '>
             <PricingTable />
        </div>
         
    </div>
  )
}

export default Plan
