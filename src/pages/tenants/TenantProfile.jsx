import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  fetchTenantById, fetchMyProfile, updateTenantProfile,
  selectTenantCurrent, selectTenantLoading
} from '../../redux/slices/tenantSlice'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import Spinner from '../../components/common/Spinner'
import { fmtDate, initials } from '../../utils/formatters'

export default function TenantProfile() {
  const { id }     = useParams()
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { isAdmin, isTenant } = useAuth()
  const authUser   = useSelector(selectCurrentUser)
  const tenant     = useSelector(selectTenantCurrent)
  const loading    = useSelector(selectTenantLoading)
  const [editing,  setEditing]  = useState(false)
  const [form,     setForm]     = useState({})

  const isOwnProfile = isTenant() && !id
  const canEdit = isAdmin() || isOwnProfile || (isTenant() && tenant?.userId === authUser?.id)

  useEffect(() => {
    if (id) dispatch(fetchTenantById(id))
    else    dispatch(fetchMyProfile())
  }, [id, dispatch])

  useEffect(() => {
    if (tenant) {
      setForm({
        currentAddress:         tenant.currentAddress || '',
        emergencyContactName:   tenant.emergencyContactName || '',
        emergencyContactPhone:  tenant.emergencyContactPhone || '',
        aadhaarRef:             tenant.aadhaarRef || '',
        panRef:                 tenant.panRef || '',
      })
    }
  }, [tenant])

  const handleSave = () => {
    dispatch(updateTenantProfile({ id: tenant.id, payload: form })).unwrap()
      .then(() => setEditing(false))
      .catch(() => {})
  }

  if (loading && !tenant) return <Spinner size="lg" className="h-64" />
  if (!tenant) return <p className="text-center text-neutral-500 py-16">Tenant not found.</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="page-header">
        <h1 className="page-title">{isOwnProfile ? 'My Profile' : 'Tenant Profile'}</h1>
        {canEdit && !editing && (
          <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      {/* Identity card */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {initials(tenant.fullName)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{tenant.fullName}</h2>
          <p className="text-sm text-neutral-500">{tenant.email}</p>
          {tenant.phone && <p className="text-sm text-neutral-400">{tenant.phone}</p>}
          <p className="text-xs text-neutral-400 mt-1">Tenant since {fmtDate(tenant.createdAt)}</p>
        </div>
      </div>

      {/* Editable details */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Personal Details</h3>
          {editing && (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm"><X size={13} /> Cancel</button>
              <button onClick={handleSave} disabled={loading} className="btn btn-primary btn-sm">
                <Save size={13} /> {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Current Address</label>
              <textarea rows={2} className="input" value={form.currentAddress}
                onChange={e => setForm(f => ({ ...f, currentAddress: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="label">Aadhaar Ref</label>
                <input className="input" value={form.aadhaarRef}
                  onChange={e => setForm(f => ({ ...f, aadhaarRef: e.target.value }))} placeholder="Last 4 digits or ref" />
              </div>
              <div className="form-group mb-0">
                <label className="label">PAN Ref</label>
                <input className="input" value={form.panRef}
                  onChange={e => setForm(f => ({ ...f, panRef: e.target.value }))} placeholder="PAN number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="label">Emergency Contact Name</label>
                <input className="input" value={form.emergencyContactName}
                  onChange={e => setForm(f => ({ ...f, emergencyContactName: e.target.value }))} />
              </div>
              <div className="form-group mb-0">
                <label className="label">Emergency Contact Phone</label>
                <input className="input" value={form.emergencyContactPhone}
                  onChange={e => setForm(f => ({ ...f, emergencyContactPhone: e.target.value }))} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { label: 'Current Address',         value: tenant.currentAddress },
              { label: 'Aadhaar Ref',             value: tenant.aadhaarRef },
              { label: 'PAN Ref',                 value: tenant.panRef },
              { label: 'Emergency Contact',       value: tenant.emergencyContactName },
              { label: 'Emergency Phone',         value: tenant.emergencyContactPhone },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
                <span className="text-neutral-400">{label}</span>
                <span className="font-medium text-neutral-700">{value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
    </div>
  )
}