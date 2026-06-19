import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Download, XCircle, RefreshCw, Upload } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  fetchAgreementById, terminateAgreement, renewAgreement,
  selectAgreementCurrent, selectAgreementLoading
} from '../../redux/slices/agreementSlice'
import { agreementService } from '../../services/agreementService'
import Spinner     from '../../components/common/Spinner'
import Badge       from '../../components/common/Badge'
import ConfirmModal from '../../components/common/ConfirmModal'
import { fmtDate, fmtINR } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function AgreementDetail() {
  const { id }      = useParams()
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { isAdmin, isOwner, isManager } = useAuth()
  const agreement   = useSelector(selectAgreementCurrent)
  const loading     = useSelector(selectAgreementLoading)
  const [showTerminate, setShowTerminate] = useState(false)
  const [showRenew,     setShowRenew]     = useState(false)
  const [uploading,     setUploading]     = useState(false)
  const [renewData,     setRenewData]     = useState({ startDate: '', endDate: '', monthlyRent: '', securityDeposit: '' })

  const canManage = isAdmin() || isOwner() || isManager()
  const isActive  = agreement?.status === 'ACTIVE'

  useEffect(() => { dispatch(fetchAgreementById(id)) }, [id, dispatch])

  const handleTerminate = () => {
    dispatch(terminateAgreement(id)).unwrap()
      .then(() => setShowTerminate(false))
      .catch(() => {})
  }

  const handleRenew = () => {
    dispatch(renewAgreement({ id, payload: renewData })).unwrap()
      .then(() => setShowRenew(false))
      .catch(() => {})
  }

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await agreementService.uploadDocument(id, fd)
      toast.success('Document uploaded!')
      dispatch(fetchAgreementById(id))
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  if (loading && !agreement) return <Spinner size="lg" className="h-64" />
  if (!agreement) return <p className="text-center text-neutral-500 py-16">Agreement not found.</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">Agreement #{agreement.id}</h1>
          <p className="text-sm text-neutral-500 mt-1">{agreement.propertyName}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge value={agreement.status} />
          {canManage && isActive && (
            <>
              <button onClick={() => setShowRenew(true)} className="btn btn-secondary btn-sm">
                <RefreshCw size={14} /> Renew
              </button>
              <button onClick={() => setShowTerminate(true)} className="btn btn-danger btn-sm">
                <XCircle size={14} /> Terminate
              </button>
            </>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Property & Parties</h3>
          {[
            { label: 'Property',  value: agreement.propertyName },
            { label: 'Tenant',    value: agreement.tenantName },
            { label: 'Owner',     value: agreement.ownerName },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
              <span className="text-neutral-500">{label}</span>
              <span className="font-medium text-neutral-800">{value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Financials & Dates</h3>
          {[
            { label: 'Monthly Rent',     value: fmtINR(agreement.monthlyRent) },
            { label: 'Security Deposit', value: fmtINR(agreement.securityDeposit) },
            { label: 'Start Date',       value: fmtDate(agreement.startDate) },
            { label: 'End Date',         value: fmtDate(agreement.endDate) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
              <span className="text-neutral-500">{label}</span>
              <span className="font-medium text-neutral-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document */}
      <div className="card">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">Agreement Document</h3>
        {agreement.documentUrl ? (
          <a href={agreement.documentUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            <Download size={14} /> Download Document
          </a>
        ) : (
          <p className="text-sm text-neutral-400 mb-3">No document uploaded yet.</p>
        )}
        {canManage && (
          <div className="mt-3">
            <label className="btn btn-secondary btn-sm cursor-pointer">
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload PDF'}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleDocUpload} disabled={uploading} />
            </label>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
        <Link to={`/payments?agreementId=${id}`} className="btn btn-secondary">View Payments</Link>
      </div>

      {/* Terminate modal */}
      <ConfirmModal
        open={showTerminate}
        title="Terminate Agreement"
        message="Are you sure you want to terminate this agreement? This action cannot be undone."
        onConfirm={handleTerminate}
        onCancel={() => setShowTerminate(false)}
        loading={loading}
      />

      {/* Renew modal */}
      {showRenew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-neutral-900">Renew Agreement</h3>
            <div className="form-group">
              <label className="label">New Start Date</label>
              <input type="date" className="input" value={renewData.startDate}
                onChange={e => setRenewData(d => ({ ...d, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">New End Date</label>
              <input type="date" className="input" value={renewData.endDate}
                onChange={e => setRenewData(d => ({ ...d, endDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Monthly Rent (₹)</label>
              <input type="number" className="input" value={renewData.monthlyRent}
                onChange={e => setRenewData(d => ({ ...d, monthlyRent: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Security Deposit (₹)</label>
              <input type="number" className="input" value={renewData.securityDeposit}
                onChange={e => setRenewData(d => ({ ...d, securityDeposit: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRenew(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleRenew} disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Renewing…' : 'Renew'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}