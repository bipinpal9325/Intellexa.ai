import { Scissors, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const RemoveObject = () => {

  const [input, setInput] = useState('')
  const [object, setObject] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      <div
        className="pointer-events-none fixed top-0 right-1/3 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Left Col */}
      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Object Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
          file:bg-[#6C5CE7]/15 file:text-[#9F91F0] focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          required
        />

        <p className='mt-6 text-sm font-medium text-slate-300'>Describe name of object to remove.</p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-[#F1F0FA] placeholder:text-slate-500 focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          placeholder='e.g., watch or spoon, Only single object name'
          required
        />

        <button className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
        text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'>
          <Scissors className='w-5' />
          Remove Object
        </button>
      </form>

      {/* Right Col */}
      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Processed Image</h1>
        </div>

        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
            <Scissors className='w-9 h-9' />
            <p>Upload an image and click "Remove Object" to get your result.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject
