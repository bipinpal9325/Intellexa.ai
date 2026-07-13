import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const ReviewResume = () => {

  const [input, setInput] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      <div
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Left Col */}
      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Resume Review</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Upload Resume</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='application/pdf'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
          file:bg-[#6C5CE7]/15 file:text-[#9F91F0] focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          required
        />

        <p className='text-xs text-slate-500 font-light mt-1'>Supports PDF Resume Only.</p>

        <button className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
        text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'>
          <FileText className='w-5' />
          Review Resume
        </button>
      </form>

      {/* Right Col */}
      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Analysis Results</h1>
        </div>

        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
            <FileText className='w-9 h-9' />
            <p>Upload a resume and click "Review Resume" to get your analysis.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewResume
