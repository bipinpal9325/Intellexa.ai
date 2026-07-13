import { Image, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const GenerateImages = () => {

  const imageStyle = ['Realistic', 'Ghibli', 'Anime', 'Cartoon',
    'Fantasy', '3D', 'Portrait']

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Left Col */}
      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Describe Your Image</p>

        <textarea
          id="image-description"
          name="imageDescription"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-[#F1F0FA] placeholder:text-slate-500 focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          placeholder='Enter a scene, style, or idea to generate an image...'
          required
        />

        <p className='mt-4 text-sm font-medium text-slate-300'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors duration-200
               ${selectedStyle === item
                  ? 'bg-[#6C5CE7]/15 text-[#9F91F0] border-[#6C5CE7]/30'
                  : 'text-slate-400 border-white/10 hover:border-white/20'}`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              id="publish-toggle"
              name="publishToggle"
              type='checkbox'
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-[#15151f] border border-white/10 rounded-full
              peer-checked:bg-[#6C5CE7] peer-checked:border-[#6C5CE7] transition-colors duration-200
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#6C5CE7]/60'>
            </div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white
              rounded-full transition-transform duration-200 peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm text-slate-300'>Upload in Community</p>
        </div>

        <button className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
        text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'>
          <Image className='w-5' />
          Generate Image
        </button>
      </form>

      {/* Right Col */}
      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Generated Images</h1>
        </div>

        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
            <Image className='w-9 h-9' />
            <p>Describe a scene and click "Generate Image" to get your image.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateImages
