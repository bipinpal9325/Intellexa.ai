import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'


const Hero = () => {

  const navigate = useNavigate()
  return (
    
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full
    justify-center bg-[url(/gradientBackgrounddd.png)] bg-cover bg-no-repeat
    min-h-screen'>
     
     
    
    
    <div className="flex items-center justify-center  text-center mb-6">
  <div>
    <h1  className="text-5xl font-bold mb-4">
      Simplifying Your Work with <br/> Smarter<span className='text-primary'> AI Tools</span>
    </h1>
    <p >
      Transforming complexity into clarity with the power of AI.<br/>
      Designed to help you work smarter, not harder.
    </p>
  </div>
</div>



   <div className='flex flex-warp justify-center gap-4 text-sm max-sm:text-xs'>
  <button onClick={()=> navigate('/ai')} className='bg-primary text-white
   px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer '>
    Start Building Now
  </button>
  <button className='bg-white px-10 py-3 rounded-lg border
  border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>
    Get a Preview
  </button> 
  </div>
   
     
  <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
    <img src={assets.user_group} alt="" className='h-8'/>Working in Progress
     & Trusted Tools for Smarter Workflows 
  </div>
  
     
  
  
    </div>

   
    
  )
}

export default Hero
