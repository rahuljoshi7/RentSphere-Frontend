import { PackageOpen } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <PackageOpen size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-neutral-700 font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}
