// Shared copy/download logic for any tool that produces plain textual
// output (articles, titles, analysis). Keeping this in one place means
// WriteArticle, BlogTitles, and ReviewResume can never drift out of sync
// on how a download or copy actually behaves.

export const downloadTextFile = (filename, content) => {
  if (!content) return false
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

export const copyToClipboard = async (content) => {
  if (!content) return false
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content)
      return true
    }
    // Fallback for non-secure contexts (plain HTTP) or older browsers
    // where navigator.clipboard isn't available.
    const textarea = document.createElement('textarea')
    textarea.value = content
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch (err) {
    console.error('Copy to clipboard failed:', err)
    return false
  }
}


