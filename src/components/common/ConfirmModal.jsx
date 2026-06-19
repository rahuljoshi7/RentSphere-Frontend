import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-danger-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-danger-600" />
          </div>
          <h3 className="font-semibold text-neutral-900">{title}</h3>
        </div>
        <p className="text-sm text-neutral-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger flex-1">
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
