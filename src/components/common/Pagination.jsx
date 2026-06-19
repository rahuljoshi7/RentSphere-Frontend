import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
        className="btn btn-secondary btn-sm disabled:opacity-40">
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-neutral-600">Page {page + 1} of {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}
        className="btn btn-secondary btn-sm disabled:opacity-40">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
