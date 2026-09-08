import { Image, Sparkles, Download, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RATE_LIMIT_COOLDOWN_SECONDS = 60

const DOWNLOAD_FORMATS = [
  { id: 'png', label: 'PNG', mime: 'image/png', supportsQuality: false, description: 'Lossless, larger file' },
  { id: 'jpeg', label: 'JPG', mime: 'image/jpeg', supportsQuality: true, description: 'Smaller file, adjustable quality' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', supportsQuality: true, description: 'Modern format, best compression' },
]

const GenerateImages = () => {

  const imageStyle = ['Realistic', 'Ghibli', 'Anime', 'Cartoon',
    'Fantasy', '3D', 'Portrait']

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const [showDownloadPanel, setShowDownloadPanel] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('png')
  const [downloadQuality, setDownloadQuality] = useState(90)
  const [downloading, setDownloading] = useState(false)

  const { getToken } = useAuth()

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please describe the image you want to generate.')
      return;
    }

    if (cooldown > 0) {
      toast.error(`Image service is rate-limited. Please wait ${cooldown}s before trying again.`)
      return;
    }

    try {
      setLoading(true)

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt: input, style: selectedStyle, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setImage(data.content)
        setShowDownloadPanel(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      const status = error?.response?.status
      const message = error?.response?.data?.message || error.message

      if (status === 429) {
        toast.error('Image service is rate-limited right now. Try again shortly.')
        setCooldown(RATE_LIMIT_COOLDOWN_SECONDS)
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetches the hosted image, re-encodes it via canvas into the user's
  // chosen format/quality, then triggers a native browser download.
  // Re-encoding client-side (rather than linking straight to the Cloudinary
  // URL) is what makes format/quality selection possible at all, since the
  // stored file is a single fixed PNG.
  const handleDownload = async () => {
    if (!image) return

    try {
      setDownloading(true)

      const response = await fetch(image, { mode: 'cors' })
      if (!response.ok) throw new Error('Failed to fetch the image for download.')
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      const loaded = new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Could not load the image for conversion.'))
      })
      img.src = objectUrl
      await loaded

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')

      // JPEG has no alpha channel — flatten onto white first, or transparent
      // areas render as black in the exported file.
      if (downloadFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)

      const formatConfig = DOWNLOAD_FORMATS.find((f) => f.id === downloadFormat)
      const qualityFraction = downloadQuality / 100

      canvas.toBlob(
        (outputBlob) => {
          if (!outputBlob) {
            toast.error('Could not generate the file for download. Try a different format.')
            return
          }
          const downloadUrl = URL.createObjectURL(outputBlob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `intellexa-ai-image-${Date.now()}.${downloadFormat === 'jpeg' ? 'jpg' : downloadFormat}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
          setShowDownloadPanel(false)
        },
        formatConfig.mime,
        formatConfig.supportsQuality ? qualityFraction : undefined
      )

      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong while preparing the download.')
    } finally {
      setDownloading(false)
    }
  }

  const activeFormat = DOWNLOAD_FORMATS.find((f) => f.id === downloadFormat)

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

        <button
          disabled={loading || cooldown > 0}
          className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
          text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
          disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
        >
          {loading
            ? <span className='w-4 h-4 my-1 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
            : <Image className='w-5' />
          }
          {loading
            ? 'Generating...'
            : cooldown > 0
              ? `Rate limited — retry in ${cooldown}s`
              : 'Generate Image'
          }
        </button>
      </form>

      {/* Right Col */}
      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image className='w-5 h-5 text-[#9F91F0]' />
            <h1 className='font-display text-xl font-medium text-white'>Generated Images</h1>
          </div>

          {image && (
            <button
              type="button"
              onClick={() => setShowDownloadPanel((prev) => !prev)}
              className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10
              text-slate-300 hover:text-white hover:border-[#6C5CE7]/50 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
            >
              <Download className='w-3.5 h-3.5' /> Download
            </button>
          )}
        </div>

        {!image ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <Image className='w-9 h-9' />
              <p>Describe a scene and click "Generate Image" to get your image.</p>
            </div>
          </div>
        ) : (
          <>
            {showDownloadPanel && (
              <div className='mt-4 p-4 bg-[#15151f] border border-white/10 rounded-xl'>
                <div className='flex items-center justify-between mb-3'>
                  <p className='text-sm font-medium text-slate-300'>Download options</p>
                  <button
                    type="button"
                    onClick={() => setShowDownloadPanel(false)}
                    className='text-slate-500 hover:text-white transition-colors'
                    aria-label="Close download options"
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>

                <p className='text-xs text-slate-500 mb-2'>File format</p>
                <div className='flex gap-2 mb-4'>
                  {DOWNLOAD_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => setDownloadFormat(format.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors
                        ${downloadFormat === format.id
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                          : 'text-slate-400 border-white/10 hover:border-white/20'}`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
                <p className='text-xs text-slate-500 -mt-2 mb-4'>{activeFormat?.description}</p>

                {activeFormat?.supportsQuality && (
                  <div className='mb-4'>
                    <div className='flex items-center justify-between mb-1'>
                      <p className='text-xs text-slate-500'>Quality</p>
                      <p className='text-xs text-slate-400'>{downloadQuality}%</p>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={downloadQuality}
                      onChange={(e) => setDownloadQuality(Number(e.target.value))}
                      className='w-full accent-[#6C5CE7]'
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
                  text-white px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors
                  disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
                >
                  {downloading
                    ? <span className='w-4 h-4 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
                    : <Download className='w-4 h-4' />
                  }
                  {downloading ? 'Preparing file...' : 'Download'}
                </button>
              </div>
            )}

            <div className='mt-3 flex-1 flex items-center justify-center'>
              <img
                src={image}
                alt="Generated"
                className='w-full max-h-[500px] object-contain rounded-lg border border-white/10'
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GenerateImages