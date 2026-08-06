import { Scissors, Sparkles, Eraser as EraserIcon, RotateCcw, Cloud, Laptop } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RATE_LIMIT_COOLDOWN_SECONDS = 60

const RemoveObject = () => {
  const [mode, setMode] = useState('cloud')
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [objectName, setObjectName] = useState('')
  const [brushSize, setBrushSize] = useState(30)
  const [hasPainted, setHasPainted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const canvasRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const isDrawing = useRef(false)

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
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onTouchStart = (e) => { e.preventDefault(); handlePointerDown(e) }
    const onTouchMove = (e) => { e.preventDefault(); handlePointerMove(e) }
    const onTouchEnd = () => handlePointerUp()

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [imageUrl])

  const onFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setResultImage('')
    setHasPainted(false)
    setImageUrl(URL.createObjectURL(selected))
  }

  const onImageLoad = () => {
    const img = imgRef.current
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!img || !canvas || !maskCanvas) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    maskCanvas.width = img.naturalWidth
    maskCanvas.height = img.naturalHeight

    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })
    maskCtx.fillStyle = 'black'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

    drawOverlayFromMask()
  }

  const drawOverlayFromMask = () => {
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !maskCanvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const maskData = maskCanvas
      .getContext('2d', { willReadFrequently: true })
      .getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const overlay = ctx.createImageData(canvas.width, canvas.height)

    for (let i = 0; i < maskData.data.length; i += 4) {
      const isPainted = maskData.data[i] > 200
      overlay.data[i] = 220
      overlay.data[i + 1] = 38
      overlay.data[i + 2] = 38
      overlay.data[i + 3] = isPainted ? 130 : 0
    }
    ctx.putImageData(overlay, 0, 0)
  }

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const paintAt = (x, y) => {
    const maskCtx = maskCanvasRef.current.getContext('2d', { willReadFrequently: true })
    maskCtx.fillStyle = 'white'
    maskCtx.beginPath()
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2)
    maskCtx.fill()
    drawOverlayFromMask()
    setHasPainted(true)
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    isDrawing.current = true
    const { x, y } = getCanvasCoords(e)
    paintAt(x, y)
  }

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return
    e.preventDefault()
    const { x, y } = getCanvasCoords(e)
    paintAt(x, y)
  }

  const handlePointerUp = () => {
    isDrawing.current = false
  }

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })
    maskCtx.fillStyle = 'black'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
    drawOverlayFromMask()
    setHasPainted(false)
  }

  const canvasToBlob = (canvas) =>
    new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload an image first.')
      return;
    }

    if (mode === 'local' && !hasPainted) {
      toast.error('Please paint over the object you want to remove.')
      return;
    }

    if (mode === 'cloud' && !objectName.trim()) {
      toast.error('Please describe the object to remove (e.g. "the red car").')
      return;
    }

    if (mode === 'cloud' && cooldown > 0) {
      toast.error(`Service is rate-limited. Please wait ${cooldown}s before trying again.`)
      return;
    }

    try {
      setLoading(true)

      const maskBlob = await canvasToBlob(maskCanvasRef.current)

      const formData = new FormData()
      formData.append('image', file)
      formData.append('mask', maskBlob, 'mask.png')
      formData.append('mode', mode)
      if (objectName.trim()) formData.append('object', objectName.trim())

      const { data } = await axios.post(
        '/api/ai/remove-object',
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
      } else if (status === 402) {
        toast.error('Free monthly credits are used up for this month.')
      } else if (status === 503 && mode === 'local') {
        toast.error('Local IOPaint server not reachable. Run: iopaint start --model=lama --device=cpu --port=8080')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-[#0a0a12] text-slate-300'>
      <div
        className="pointer-events-none fixed top-0 right-1/3 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <form onSubmit={onSubmitHandler} className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl
      border border-white/10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Object Removal</h1>
        </div>

        <div className='mt-5 flex gap-2 p-1 bg-[#15151f] border border-white/10 rounded-xl'>
          <button
            type="button"
            onClick={() => setMode('cloud')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors
              ${mode === 'cloud' ? 'bg-[#6C5CE7] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Cloud className='w-4 h-4' /> Cloud (PhotoRoom, 500/min limit)
          </button>
          <button
            type="button"
            onClick={() => setMode('local')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors
              ${mode === 'local' ? 'bg-[#6C5CE7] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Laptop className='w-4 h-4' /> Local (unlimited, self-hosted)
          </button>
        </div>

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

        {imageUrl && (
          <div className='mt-4'>
            <p className='text-xs text-slate-500 mb-2'>
              {mode === 'local'
                ? 'Paint over the object you want to remove — red highlight marks what will be erased.'
                : 'Optional: paint over the object for reference — PhotoRoom uses your description below to identify what to remove.'}
            </p>
            <div className='relative w-full rounded-lg overflow-hidden border border-white/10 bg-[#15151f]'>
              <img
                ref={imgRef}
                src={imageUrl}
                alt="To edit"
                onLoad={onImageLoad}
                className='w-full h-auto block select-none pointer-events-none'
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                className='absolute inset-0 w-full h-full cursor-crosshair touch-none'
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
              />
              <canvas ref={maskCanvasRef} className='hidden' />
            </div>

            <div className='mt-3 flex items-center gap-3'>
              <label className='text-xs text-slate-400 shrink-0'>Brush size</label>
              <input
                type="range"
                min="10"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className='flex-1 accent-[#6C5CE7]'
              />
              <button
                type="button"
                onClick={clearMask}
                className='flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10
                text-slate-400 hover:text-white hover:border-white/20 transition-colors'
              >
                <RotateCcw className='w-3.5 h-3.5' /> Clear
              </button>
            </div>
          </div>
        )}

        <p className='mt-6 text-sm font-medium text-slate-300'>
          {mode === 'cloud' ? 'Describe the object to remove' : 'Object name (optional)'}
        </p>

        <input
          onChange={(e) => setObjectName(e.target.value)}
          value={objectName}
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg bg-[#15151f] border border-white/10
          text-[#F1F0FA] placeholder:text-slate-500 focus:border-[#6C5CE7] transition-colors
          focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
          placeholder={mode === 'cloud' ? 'e.g., the red car in the background' : 'e.g., watch or spoon — used for your history label'}
        />

        <button
          disabled={loading || (mode === 'cloud' && cooldown > 0)}
          className='w-full flex justify-center items-center gap-2 bg-[#6C5CE7] hover:bg-[#5B4BD6]
          text-white px-4 py-2.5 mt-6 text-sm font-medium rounded-xl cursor-pointer transition-colors
          disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/60'
        >
          {loading
            ? <span className='w-4 h-4 my-1 rounded-full border-2 border-white/40 border-t-transparent animate-spin' />
            : <Scissors className='w-5' />
          }
          {loading
            ? 'Removing object...'
            : mode === 'cloud' && cooldown > 0
              ? `Rate limited — retry in ${cooldown}s`
              : 'Remove Object'
          }
        </button>
      </form>

      <div className='relative w-full max-w-lg p-4 bg-white/[0.03] rounded-2xl flex flex-col border
      border-white/10 backdrop-blur-sm min-h-96'>
        <div className='flex items-center gap-3'>
          <EraserIcon className='w-5 h-5 text-[#9F91F0]' />
          <h1 className='font-display text-xl font-medium text-white'>Processed Image</h1>
        </div>

        {!resultImage ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-slate-500'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image, paint the object, and click "Remove Object" to get your result.</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 flex-1 flex items-center justify-center'>
            <img
              src={resultImage}
              alt="Object removed"
              className='w-full max-h-[500px] object-contain rounded-lg border border-white/10'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveObject