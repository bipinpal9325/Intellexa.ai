import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload a resume PDF first.')
      return;
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('resume', file)

      const { data } = await axios.post(
        '/api/ai/review-resume',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      <div
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Resume Review</h1>
        </div>
        <p className='mt-6 text-sm font-medium text-slate-300'>Upload Resume</p>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept='application/pdf'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
          file:bg-[#6C5CE7]/15 file:text-[#9F91F0] focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          required
        />

        <p className='text-xs text-slate-500 font-light mt-1'>Supports PDF Resume Only.</p>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
          text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
          disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
        >
          {loading
            ? <span className='w-4 h-4 my-1 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
            : <FileText className='w-5' />
          }
          {loading ? 'Reviewing...' : 'Review Resume'}
        </button>
      </form>

      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Analysis Results</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get your analysis.</p>
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

export default ReviewResume