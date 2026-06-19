import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, UserX } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import { useDebounce } from '../../hooks/useDebounce'
import {
  fetchAllTenants, fetchMyTenants, searchTenants, deactivateTenant,
  selectTenantList, selectTenantLoading
} from '../../redux/slices/tenantSlice'
import Spinner     from '../../components/common/Spinner'
import EmptyState  from '../../components/common/EmptyState'
import Pagination  from '../../components/common/Pagination'
import ConfirmModal from '../../components/common/ConfirmModal'
import { fmtDate, initials } from '../../utils/formatters'

export default function TenantsPage() {
  const dispatch  = useDispatch()
  const { isAdmin, isOwner, isManager } = useAuth()
  const data      = useSelector(selectTenantList)
  const loading   = useSelector(selectTenantLoading)
  const { page, size, setPage } = usePagination()
  const [search,      setSearch]      = useState('')
  const [deactivateId, setDeactivateId] = useState(null)
  const debouncedQ = useDebounce(search)

  useEffect(() => {
    const params = { page, size }
    if (debouncedQ.trim()) {
      dispatch(searchTenants({ q: debouncedQ, params }))
    } else if (isOwner()) {
      dispatch(fetchMyTenants(params))
    } else {
      dispatch(fetchAllTenants(params))
    }
  }, [page, size, debouncedQ, dispatch])

  const handleDeactivate = () => {
    dispatch(deactivateTenant(deactivateId)).unwrap()
      .then(() => setDeactivateId(null))
      .catch(() => setDeactivateId(null))
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Tenants</h1>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="input pl-9" placeholder="Search by name or email…" />
        </div>
      </div>

      {loading && !data ? <Spinner size="lg" className="h-48" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState title="No tenants found" description="Tenants will appear here once they register." />
          ) : (
            <>
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Tenant</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Emergency Contact</th>
                      <th className="px-4 py-3 font-medium">Since</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.content.map(t => (
                      <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {initials(t.fullName)}
                            </div>
                            <span className="font-medium text-neutral-800">{t.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-500">{t.email}</td>
                        <td className="px-4 py-3 text-neutral-500">{t.phone || '—'}</td>
                        <td className="px-4 py-3 text-neutral-500">{t.emergencyContactName || '—'}</td>
                        <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link to={`/tenants/${t.id}`} className="btn btn-secondary btn-sm">View</Link>
                            {isAdmin() && (
                              <button onClick={() => setDeactivateId(t.id)} className="btn btn-danger btn-sm">
                                <UserX size={13} />
                              </button>
                            )}
                          </div>
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

      <ConfirmModal
        open={!!deactivateId}
        title="Deactivate Tenant"
        message="Are you sure you want to deactivate this tenant? They will lose access to the platform."
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
        loading={loading}
      />
    </div>
  )
}