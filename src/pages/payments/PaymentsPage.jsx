import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import {
  fetchMyPayments, fetchPaymentsByStatus, fetchPaymentsByTenant,
  selectPaymentList, selectPaymentLoading
} from '../../redux/slices/paymentSlice'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtDate, fmtINR, PAYMENT_STATUSES } from '../../utils/formatters'

export default function PaymentsPage() {
  const dispatch  = useDispatch()
  const { isAdmin, isOwner, isManager, isTenant } = useAuth()
  const user      = useSelector(selectCurrentUser)
  const data      = useSelector(selectPaymentList)
  const loading   = useSelector(selectPaymentLoading)
  const { page, size, setPage } = usePagination()
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = { page, size }
    if (statusFilter && (isAdmin() || isOwner() || isManager())) {
      dispatch(fetchPaymentsByStatus({ status: statusFilter, params }))
    } else if (isTenant() && user?.tenantId) {
      dispatch(fetchPaymentsByTenant({ tenantId: user.tenantId, params }))
    } else {
      dispatch(fetchMyPayments(params))
    }
  }, [page, size, statusFilter, dispatch])

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
      </div>

      {/* Filters */}
      {(isAdmin() || isOwner() || isManager()) && (
        <div className="card p-4">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0) }} className="input sm:w-56">
            <option value="">All Statuses</option>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {loading && !data ? <Spinner size="lg" className="h-48" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState title="No payments found" description="Payment records will appear here." />
          ) : (
            <>
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Property</th>
                      <th className="px-4 py-3 font-medium">Period</th>
                      <th className="px-4 py-3 font-medium">Due</th>
                      <th className="px-4 py-3 font-medium">Paid</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.content.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-neutral-900">{p.propertyName}</td>
                        <td className="px-4 py-3 text-neutral-500">{p.month}/{p.year}</td>
                        <td className="px-4 py-3 text-neutral-800">{fmtINR(p.amountDue)}</td>
                        <td className="px-4 py-3 text-neutral-800">{fmtINR(p.amountPaid)}</td>
                        <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmtDate(p.dueDate)}</td>
                        <td className="px-4 py-3"><Badge value={p.status} /></td>
                        <td className="px-4 py-3">
                          <Link to={`/payments/${p.id}`} className="btn btn-secondary btn-sm">View</Link>
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