import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import {
  fetchMyAgreements, fetchAgreementsByTenant,
  selectAgreementList, selectAgreementLoading
} from '../../redux/slices/agreementSlice'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtDate, fmtINR, AGREEMENT_STATUSES } from '../../utils/formatters'

export default function AgreementsPage() {
  const dispatch  = useDispatch()
  const { isAdmin, isOwner, isManager, isTenant } = useAuth()
  const user      = useSelector(selectCurrentUser)
  const data      = useSelector(selectAgreementList)
  const loading   = useSelector(selectAgreementLoading)
  const { page, size, setPage } = usePagination()
  const [statusFilter, setStatusFilter] = useState('')

  const canCreate = isAdmin() || isOwner() || isManager()

  useEffect(() => {
    const params = { page, size, ...(statusFilter && { status: statusFilter }) }
    if (isTenant() && user?.tenantId) {
      dispatch(fetchAgreementsByTenant({ id: user.tenantId, params }))
    } else {
      dispatch(fetchMyAgreements(params))
    }
  }, [page, size, statusFilter, dispatch])

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Rental Agreements</h1>
        {canCreate && (
          <Link to="/agreements/new" className="btn btn-primary">
            <Plus size={16} /> New Agreement
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="card p-4">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }} className="input sm:w-56">
          <option value="">All Statuses</option>
          {AGREEMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading && !data ? <Spinner size="lg" className="h-48" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState
              title="No agreements found"
              description="Rental agreements will appear here once created."
              action={canCreate && <Link to="/agreements/new" className="btn btn-primary">Create Agreement</Link>}
            />
          ) : (
            <>
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Property</th>
                      <th className="px-4 py-3 font-medium">Tenant</th>
                      <th className="px-4 py-3 font-medium">Period</th>
                      <th className="px-4 py-3 font-medium">Monthly Rent</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.content.map(a => (
                      <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-neutral-900">{a.propertyName}</td>
                        <td className="px-4 py-3 text-neutral-600">{a.tenantName}</td>
                        <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                          {fmtDate(a.startDate)} – {fmtDate(a.endDate)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-neutral-800">{fmtINR(a.monthlyRent)}</td>
                        <td className="px-4 py-3"><Badge value={a.status} /></td>
                        <td className="px-4 py-3">
                          <Link to={`/agreements/${a.id}`} className="btn btn-secondary btn-sm">View</Link>
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