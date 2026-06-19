import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, CreditCard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  fetchPaymentById, recordPayment,
  selectPaymentCurrent, selectPaymentLoading
} from '../../redux/slices/paymentSlice'
import Spinner  from '../../components/common/Spinner'
import Badge    from '../../components/common/Badge'
import { fmtDate, fmtINR } from '../../utils/formatters'

export default function PaymentDetail() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isAdmin, isOwner, isManager } = useAuth()
  const payment   = useSelector(selectPaymentCurrent)
  const loading   = useSelector(selectPaymentLoading)
  const [showRecord, setShowRecord] = useState(false)
  const [notes,      setNotes]      = useState('')

  const canRecord = (isAdmin() || isOwner() || isManager()) && payment?.status !== 'PAID'

  useEffect(() => { dispatch(fetchPaymentById(id)) }, [id, dispatch])

  const handleRecord = () => {
    dispatch(recordPayment({ id, payload: { notes } })).unwrap()
      .then(() => setShowRecord(false))
      .catch(() => {})
  }

  if (loading && !payment) return <Spinner size="lg" className="h-64" />
  if (!payment) return <p className="text-center text-neutral-500 py-16">Payment not found.</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment #{payment.id}</h1>
          <p className="text-sm text-neutral-500 mt-1">{payment.propertyName} · {payment.month}/{payment.year}</p>
        </div>
        <Badge value={payment.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Details</h3>
          {[
            { label: 'Property',    value: payment.propertyName },
            { label: 'Tenant',      value: payment.tenantName },
            { label: 'Month/Year',  value: `${payment.month}/${payment.year}` },
            { label: 'Amount Due',  value: fmtINR(payment.amountDue) },
            { label: 'Amount Paid', value: fmtINR(payment.amountPaid) },
            { label: 'Due Date',    value: fmtDate(payment.dueDate) },
            { label: 'Paid Date',   value: payment.paidDate ? fmtDate(payment.paidDate) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
              <span className="text-neutral-500">{label}</span>
              <span className="font-medium text-neutral-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Actions</h3>
          {payment.status === 'PAID' ? (
            <div className="flex items-center gap-2 text-success-600">
              <CheckCircle2 size={20} />
              <span className="font-medium">Payment received on {fmtDate(payment.paidDate)}</span>
            </div>
          ) : canRecord ? (
            <>
              {!showRecord ? (
                <button onClick={() => setShowRecord(true)} className="btn btn-primary w-full justify-center">
                  <CreditCard size={16} /> Mark as Paid
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="form-group">
                    <label className="label">Notes (optional)</label>
                    <textarea rows={3} className="input" value={notes}
                      onChange={e => setNotes(e.target.value)} placeholder="Payment reference, mode, etc." />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowRecord(false)} className="btn btn-secondary flex-1">Cancel</button>
                    <button onClick={handleRecord} disabled={loading} className="btn btn-primary flex-1">
                      {loading ? 'Recording…' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-neutral-400">Payment is {payment.status.toLowerCase()}.</p>
          )}
          {payment.notes && (
            <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
              <strong className="block mb-1">Notes</strong>{payment.notes}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
    </div>
  )
}