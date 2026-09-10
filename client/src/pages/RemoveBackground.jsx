import { Eraser, Sparkles, Cloud, Laptop, Download, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { removeBackground as imglyRemoveBackground, preload } from '@imgly/background-removal'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RATE_LIMIT_COOLDOWN_SECONDS = 60

const DOWNLOAD_FORMATS = [
  { id: 'png', label: 'PNG', mime: 'image/png', supportsQuality: false, description: 'Keeps transparency — recommended' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', supportsQuality: true, description: 'Keeps transparency, smaller file' },
  { id: 'jpeg', label: 'JPG', mime: 'image/jpeg', supportsQuality: true, description: 'No transparency — background becomes white' },
]

const RemoveBackground = () => {

  const [mode, setMode] = useState('server')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [localModelReady, setLocalModelReady] = useState(false)
  const [localModelProgress, setLocalModelProgress] = useState(0)

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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (mode !== 'local' || localModelReady) return

    let cancelled = false
    preload({
      progress: (key, current, total) => {
        if (cancelled) return
        setLocalModelProgress(total ? Math.round((current / total) * 100) : 0)
      }
    }).then(() => {
      if (!cancelled) setLocalModelReady(true)
    }).catch((err) => {
      console.error('Failed to preload local background-removal model:', err)
      toast.error('Could not load the local processing model. Try the Cloud mode instead.')
    })

    return () => { cancelled = true }
  }, [mode, localModelReady])

  const onFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
    setResultImage('')
    setShowDownloadPanel(false)
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected))
    } else {
      setPreviewUrl('')
    }
  }

  const persistLocalResult = async (resultBlob) => {
    try {
      const formData = new FormData()
      formData.append('image', resultBlob, 'result.png')
      formData.append('type', 'background-removal')
      formData.append('prompt', 'Background removed locally in browser')

      await axios.post(
        '/api/ai/save-local-creation',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    } catch (err) {
      console.error('Failed to save local creation to history:', err)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please choose an image to upload.')
      return;
    }

    if (mode === 'server' && cooldown > 0) {
      toast.error(`Service is rate-limited. Please wait ${cooldown}s before trying again.`)
      return;
    }

    if (mode === 'local' && !localModelReady) {
      toast.error(`Local model is still loading (${localModelProgress}%)... please wait a moment.`)
      return;
    }

    setLoading(true)
    setShowDownloadPanel(false)

    if (mode === 'local') {
      try {
        const resultBlob = await imglyRemoveBackground(file)
        const url = URL.createObjectURL(resultBlob)
        setResultImage(url)
        persistLocalResult(resultBlob)
      } catch (error) {
        console.error(error)
        toast.error('Local processing failed. Try the Cloud mode instead.')
      } finally {
        setLoading(false)
      }
      return;
    }

    try {
      const formData = new FormData()
      formData.append('image', file)

      const { data } = await axios.post(
        '/api/ai/remove-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (data.success) {
        setResultImage(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      const status = error?.response?.status
      const message = error?.response?.data?.message || error.message

      if (status === 429) {
        toast.error('Service is rate-limited right now. Try again shortly.')
        setCooldown(RATE_LIMIT_COOLDOWN_SECONDS)
      } else if (status === 503) {
        toast.error('The model is warming up — please try again in a few seconds.')
      } else if (status === 402) {
        toast.error('Free monthly credits are used up for this month.')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  // resultImage may be a Cloudinary URL (server mode) OR a local blob: URL
  // (local mode) — fetch() handles both transparently, no branch needed.
  const handleDownload = async () => {
    if (!resultImage) return

    try {
      setDownloading(true)

      const response = await fetch(resultImage)
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
          link.download = `intellexa-ai-background-removed-${Date.now()}.${downloadFormat === 'jpeg' ? 'jpg' : downloadFormat}`
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
        className="pointer-events-none fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Left Col */}
      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Background Removal</h1>
        </div>

        <div className='mt-5 flex gap-2 p-1 bg-[#15151f] border border-white/10 rounded-xl'>
          <button
            type="button"
            onClick={() => setMode('server')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors
              ${mode === 'server' ? 'bg-[#6C5CE7] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Cloud className='w-4 h-4' /> Cloud (fast, limited/month)
          </button>
          <button
            type="button"
            onClick={() => setMode('local')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors
              ${mode === 'local' ? 'bg-[#6C5CE7] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Laptop className='w-4 h-4' /> Local (unlimited, slower first time)
          </button>
        </div>

        {mode === 'local' && !localModelReady && (
          <p className='mt-2 text-xs text-[#9F91F0]'>
            Loading local model... {localModelProgress}%
          </p>
        )}
        {mode === 'local' && localModelReady && (
          <p className='mt-2 text-xs text-emerald-400'>Local model ready.</p>
        )}

        <p className='mt-4 text-sm font-medium text-slate-300'>Upload Image</p>

        <input
          onChange={onFileChange}
          type="file"
          accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
          file:bg-[#6C5CE7]/15 file:text-[#9F91F0] focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          required
        />

        <p className='text-xs text-slate-500 font-light mt-1'>Supports JPG, PNG, and other image formats.</p>

        {previewUrl && (
          <div className='mt-4'>
            <p className='text-xs text-slate-500 mb-2'>Preview</p>
            <img
              src={previewUrl}
              alt="Selected upload preview"
              className='w-full max-h-48 object-contain rounded-lg border border-white/10 bg-[#15151f]'
            />
          </div>
        )}

        <button
          disabled={loading || (mode === 'server' && cooldown > 0) || (mode === 'local' && !localModelReady)}
          className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
          text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
          disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
        >
          {loading
            ? <span className='w-4 h-4 my-1 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
            : <Eraser className='w-5' />
          }
          {loading
            ? 'Removing background...'
            : mode === 'server' && cooldown > 0
              ? `Rate limited — retry in ${cooldown}s`
              : mode === 'local' && !localModelReady
                ? 'Loading model...'
                : 'Remove Background'
          }
        </button>
      </form>

      {/* Right Col */}
      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Eraser className='w-5 h-5 text-[#9F91F0]' />
            <h1 className='font-display text-xl font-medium text-white'>Processed Image</h1>
          </div>

          {resultImage && (
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

        {!resultImage ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get your result.</p>
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
              <div
                className='w-full max-h-[500px] rounded-lg border border-white/10 p-2'
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #2a2a35 25%, transparent 25%), linear-gradient(-45deg, #2a2a35 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a35 75%), linear-gradient(-45deg, transparent 75%, #2a2a35 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#1a1a24',
                }}
              >
                <img
                  src={resultImage}
                  alt="Background removed"
                  className='w-full max-h-[480px] object-contain'
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground