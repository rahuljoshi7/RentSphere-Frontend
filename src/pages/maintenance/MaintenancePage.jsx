import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import {
  fetchMyMaintenance, fetchAssignedMaintenance, fetchMaintenanceByStatus, fetchMaintenanceForOwner,
  selectMaintenanceList, selectMaintenanceLoading
} from '../../redux/slices/maintenanceSlice'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtDate, MAINTENANCE_STATUSES, PRIORITIES } from '../../utils/formatters'

export default function MaintenancePage() {
  const dispatch  = useDispatch()
  const { isAdmin, isOwner, isManager, isTenant, isStaff } = useAuth()
  const data      = useSelector(selectMaintenanceList)
  const loading   = useSelector(selectMaintenanceLoading)
  const { page, size, setPage } = usePagination()
  const [statusFilter,   setStatusFilter]   = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const canManage = isAdmin() || isOwner() || isManager()

  useEffect(() => {
    const params = { page, size, ...(priorityFilter && { priority: priorityFilter }) }
    if (isTenant()) {
      dispatch(fetchMyMaintenance(params))
    } else if (isStaff()) {
      dispatch(fetchAssignedMaintenance(params))
    } else if (statusFilter && canManage) {
      dispatch(fetchMaintenanceByStatus({ status: statusFilter, params }))
    } else if (isOwner() || isManager()) {
      dispatch(fetchMaintenanceForOwner(params))
    } else {
      // admin — all by status or all open
      const s = statusFilter || 'OPEN'
      dispatch(fetchMaintenanceByStatus({ status: s, params }))
    }
  }, [page, size, statusFilter, priorityFilter, dispatch])

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Maintenance Requests</h1>
        {isTenant() && (
          <Link to="/maintenance/new" className="btn btn-primary">
            <Plus size={16} /> Raise Request
          </Link>
        )}
      </div>

      {/* Filters */}
      {!isTenant() && (
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }} className="input sm:w-48">
            <option value="">All Statuses</option>
            {MAINTENANCE_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(0) }} className="input sm:w-40">
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}

      {loading && !data ? <Spinner size="lg" className="h-48" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState
              title="No maintenance requests found"
              description={isTenant() ? "Raise a request if something needs attention." : "No requests match your filters."}
              action={isTenant() && <Link to="/maintenance/new" className="btn btn-primary">Raise Request</Link>}
            />
          ) : (
            <>
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Property</th>
                      {!isTenant() && <th className="px-4 py-3 font-medium">Tenant</th>}
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Raised</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.content.map(r => (
                      <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs truncate">{r.title}</td>
                        <td className="px-4 py-3 text-neutral-600">{r.propertyName}</td>
                        {!isTenant() && <td className="px-4 py-3 text-neutral-500">{r.tenantName}</td>}
                        <td className="px-4 py-3"><Badge value={r.priority} /></td>
                        <td className="px-4 py-3"><Badge value={r.status} /></td>
                        <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link to={`/maintenance/${r.id}`} className="btn btn-secondary btn-sm">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  )
}