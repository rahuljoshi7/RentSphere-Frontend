import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import { facilityService } from '../../services/facilityService'
import { propertyService  } from '../../services/propertyService'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtDate, FACILITY_TYPES, titleCase } from '../../utils/formatters'
import toast from 'react-hot-toast'
import { Plus, MessageSquare, CheckCircle } from 'lucide-react'

export default function FacilitiesPage() {
  const { isAdmin, isOwner, isManager, isTenant } = useAuth()
  const { page, size, setPage } = usePagination()
  const canManage = isAdmin() || isOwner() || isManager()

  const [properties,  setProperties]  = useState([])
  const [selPropId,   setSelPropId]   = useState('')
  const [facilities,  setFacilities]  = useState([])
  const [complaints,  setComplaints]  = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [activeTab,   setActiveTab]   = useState('facilities') // 'facilities' | 'complaints'

  // For raising a complaint
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [selFacilityId,      setSelFacilityId]      = useState('')
  const [complaintText,      setComplaintText]       = useState('')
  const [submitting,         setSubmitting]          = useState(false)

  // For adding a facility
  const [showFacilityModal,  setShowFacilityModal]  = useState(false)
  const [facilityForm,       setFacilityForm]        = useState({ facilityType: '', status: 'ACTIVE', description: '' })

  useEffect(() => {
    propertyService.getAll({ page: 0, size: 100 })
      .then(r => { const list = r.data.content || []; setProperties(list); if (list.length) setSelPropId(String(list[0].id)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selPropId) return
    setLoading(true)
    facilityService.getByProperty(selPropId)
      .then(r => setFacilities(r.data || []))
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false))

    if (canManage) {
      facilityService.getComplaintsByProperty(selPropId, '', { page, size })
        .then(r => setComplaints(r.data))
        .catch(() => setComplaints(null))
    }
  }, [selPropId, page, size])

  const loadMyComplaints = () => {
    facilityService.getMyComplaints({ page, size })
      .then(r => setComplaints(r.data))
      .catch(() => {})
  }

  useEffect(() => {
    if (isTenant()) loadMyComplaints()
  }, [page, size])

  const handleRaiseComplaint = async () => {
    if (!selFacilityId || !complaintText.trim()) return toast.error('Fill all fields')
    setSubmitting(true)
    try {
      await facilityService.raiseComplaint({ facilityId: Number(selFacilityId), complaintText })
      toast.success('Complaint raised!')
      setShowComplaintModal(false); setComplaintText(''); setSelFacilityId('')
      if (isTenant()) loadMyComplaints()
    } catch (e) { toast.error(e.userMessage || 'Failed to raise complaint') }
    finally { setSubmitting(false) }
  }

  const handleResolve = async (cid) => {
    try {
      await facilityService.resolveComplaint(cid)
      toast.success('Complaint resolved!')
      facilityService.getComplaintsByProperty(selPropId, '', { page, size })
        .then(r => setComplaints(r.data))
    } catch (e) { toast.error(e.userMessage || 'Failed to resolve') }
  }

  const handleAddFacility = async () => {
    if (!facilityForm.facilityType) return toast.error('Select a facility type')
    try {
      await facilityService.add(selPropId, facilityForm)
      toast.success('Facility added!')
      setShowFacilityModal(false)
      facilityService.getByProperty(selPropId).then(r => setFacilities(r.data || []))
    } catch (e) { toast.error(e.userMessage || 'Failed to add facility') }
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Facilities & Complaints</h1>
        <div className="flex gap-2">
          {canManage && selPropId && (
            <button onClick={() => setShowFacilityModal(true)} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Facility
            </button>
          )}
          {isTenant() && facilities.length > 0 && (
            <button onClick={() => setShowComplaintModal(true)} className="btn btn-primary btn-sm">
              <MessageSquare size={14} /> Raise Complaint
            </button>
          )}
        </div>
      </div>

      {/* Property selector */}
      {properties.length > 1 && (
        <div className="card p-4">
          <select value={selPropId} onChange={e => setSelPropId(e.target.value)} className="input sm:w-72">
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        {['facilities', 'complaints'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
            {titleCase(tab)}
          </button>
        ))}
      </div>

      {loading ? <Spinner size="lg" className="h-48" /> : activeTab === 'facilities' ? (
        <>
          {!facilities.length ? (
            <EmptyState title="No facilities" description="No facilities have been added to this property yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map(f => (
                <div key={f.id} className="card space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-800">{titleCase(f.facilityType)}</h3>
                    <Badge value={f.status} />
                  </div>
                  {f.description && <p className="text-sm text-neutral-500">{f.description}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {!complaints?.content?.length ? (
            <EmptyState title="No complaints" description="No facility complaints found." />
          ) : (
            <>
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Facility</th>
                      {!isTenant() && <th className="px-4 py-3 font-medium">Tenant</th>}
                      <th className="px-4 py-3 font-medium">Complaint</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      {canManage && <th className="px-4 py-3 font-medium"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {complaints.content.map(c => (
                      <tr key={c.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 text-neutral-800">{titleCase(c.facilityType)}</td>
                        {!isTenant() && <td className="px-4 py-3 text-neutral-500">{c.tenantName}</td>}
                        <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">{c.complaintText}</td>
                        <td className="px-4 py-3"><Badge value={c.status} /></td>
                        <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{fmtDate(c.createdAt)}</td>
                        {canManage && (
                          <td className="px-4 py-3">
                            {c.status !== 'RESOLVED' && (
                              <button onClick={() => handleResolve(c.id)} className="btn btn-secondary btn-sm">
                                <CheckCircle size={13} /> Resolve
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={complaints.page} totalPages={complaints.totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {/* Raise Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-neutral-900">Raise Facility Complaint</h3>
            <div className="form-group">
              <label className="label">Facility</label>
              <select value={selFacilityId} onChange={e => setSelFacilityId(e.target.value)} className="input">
                <option value="">Select facility</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{titleCase(f.facilityType)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Complaint</label>
              <textarea rows={4} className="input" value={complaintText}
                onChange={e => setComplaintText(e.target.value)} placeholder="Describe the issue…" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowComplaintModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleRaiseComplaint} disabled={submitting} className="btn btn-primary flex-1">
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Facility Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-neutral-900">Add Facility</h3>
            <div className="form-group">
              <label className="label">Facility Type</label>
              <select value={facilityForm.facilityType}
                onChange={e => setFacilityForm(f => ({ ...f, facilityType: e.target.value }))} className="input">
                <option value="">Select type</option>
                {FACILITY_TYPES.map(t => <option key={t} value={t}>{titleCase(t)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select value={facilityForm.status}
                onChange={e => setFacilityForm(f => ({ ...f, status: e.target.value }))} className="input">
                {['ACTIVE', 'INACTIVE', 'UNDER_REPAIR'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Description (optional)</label>
              <textarea rows={3} className="input" value={facilityForm.description}
                onChange={e => setFacilityForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFacilityModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleAddFacility} className="btn btn-primary flex-1">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}