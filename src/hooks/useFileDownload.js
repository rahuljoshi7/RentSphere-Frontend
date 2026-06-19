import toast from 'react-hot-toast'

export function useFileDownload() {
  const download = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${filename} downloaded`)
  }
  return { download }
}
