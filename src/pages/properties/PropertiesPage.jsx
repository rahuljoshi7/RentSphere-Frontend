import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usePagination } from '../../hooks/usePagination'
import { useDebounce } from '../../hooks/useDebounce'
import { propertyService } from '../../services/propertyService'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtINR, PROPERTY_TYPES } from '../../utils/formatters'
import { Building2 } from 'lucide-react'

export default function PropertiesPage() {
  const { isAdmin, isOwner, isManager } = useAuth()
  const { page, size, setPage } = usePagination()
  const [data,   setData]   = useState(null)
  const [loading,setLoading]= useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setType] = useState('')
  const debouncedSearch = useDebounce(search)

  const canManage = isAdmin() || isOwner() || isManager()

  useEffect(() => {
    setLoading(true)
    const fn = canManage ? propertyService.getAll : propertyService.search
    const params = { page, size, ...(debouncedSearch && { name: debouncedSearch }), ...(typeFilter && { type: typeFilter }) }
    fn(params)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, size, debouncedSearch, typeFilter])

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Properties</h1>
        {canManage && (
          <Link to="/properties/new" className="btn btn-primary">
            <Plus size={16} /> Add Property
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="input pl-9" placeholder="Search by name or city…" />
        </div>
        <select value={typeFilter} onChange={e => { setType(e.target.value); setPage(0) }} className="input sm:w-48">
          <option value="">All Types</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <Spinner size="lg" className="h-48" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState title="No properties found" description="Try adjusting your filters"
              action={canManage && <Link to="/properties/new" className="btn btn-primary">Add Property</Link>} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.content.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  )
}

function PropertyCard({ property: p }) {
  const primaryImg = p.images?.find(i => i.isPrimary) || p.images?.[0]

  return (
    <Link to={`/properties/${p.id}`} className="card-hover group block">
      <div className="h-40 bg-neutral-100 rounded-lg overflow-hidden mb-4">
        {primaryImg
          ? <img src={primaryImg.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><Building2 size={40} className="text-neutral-300" /></div>
        }
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-neutral-900 truncate">{p.name}</h3>
        <Badge value={p.availabilityStatus} />
      </div>
      <p className="text-sm text-neutral-500 truncate mb-3">{p.address}, {p.city}</p>
      <div className="flex items-center justify-between">
        <span className="text-primary-600 font-bold">{fmtINR(p.rentAmount)}<span className="text-xs text-neutral-400 font-normal">/mo</span></span>
        <span className="text-xs text-neutral-400">{p.numRooms} rooms · {p.propertyType}</span>
      </div>
    </Link>
  )
}
