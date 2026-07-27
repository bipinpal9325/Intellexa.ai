import { useAuth } from '@clerk/clerk-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const DevTokenCopy = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [copying, setCopying] = useState(false)

  // Only render in development — never ship this to production
  if (import.meta.env.PROD) return null
  if (!isLoaded || !isSignedIn) return null

  const handleCopyToken = async () => {
    setCopying(true)
    try {
      const token = await getToken()
      await navigator.clipboard.writeText(token)
      console.log('Bearer token:', token)
      toast.success('Token copied to clipboard')
    } catch (err) {
      toast.error('Failed to get token')
      console.error(err)
    } finally {
      setCopying(false)
    }
  }

  return (
    <button
      onClick={handleCopyToken}
      disabled={copying}
      className='fixed bottom-4 right-4 z-50 rounded-md bg-purple-600 px-3 py-2 text-xs text-white shadow-lg hover:bg-purple-700'
    >
      {copying ? 'Copying...' : 'Copy Auth Token'}
    </button>
  )
}

export default DevTokenCopy