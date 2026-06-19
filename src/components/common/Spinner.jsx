// src/components/common/Spinner.jsx
import { Loader2 } from 'lucide-react'

export default function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 16, md: 24, lg: 40 }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={sz} className="animate-spin text-primary-600" />
    </div>
  )
}
