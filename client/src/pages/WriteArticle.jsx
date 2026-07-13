import React, { useState } from 'react'
import { Edit, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please enter a topic for your article.')
      return;
    }

    try {
      setLoading(true)

      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      {/* Single subtle glow, kept faint since this is a dense/utility page */}
      <div
        className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Article Configuration</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Article Topic</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-[#F1F0FA] placeholder:text-slate-500 focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          placeholder='Turn your ideas into polished articles using AI.....'
        />

        <p className='mt-4 text-sm font-medium text-slate-300'>Article Length</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors duration-200
               ${selectedLength.text === item.text
                  ? 'bg-[#6C5CE7]/15 text-[#9F91F0] border-[#6C5CE7]/30'
                  : 'text-slate-400 border-white/10 hover:border-white/20'}`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
          text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
          disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
        >
          {loading
            ? <span className='w-4 h-4 my-1 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
            : <Edit className='w-5' />
          }
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
      </form>

      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
        border-white/10 backdrop-blur-sm min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Generated Article</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click "Generate Article" to get Article</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-300'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WriteArticle
