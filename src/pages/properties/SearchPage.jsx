import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Building2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { searchProperties, selectProperties, selectPropertyLoading } from '../../redux/slices/propertySlice'
import { usePagination } from '../../hooks/usePagination'
import { useDebounce } from '../../hooks/useDebounce'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Badge      from '../../components/common/Badge'
import { fmtINR, PROPERTY_TYPES } from '../../utils/formatters'
import { propertyService } from '../../services/propertyService'

export default function SearchPage() {
  const dispatch = useDispatch()
  const data     = useSelector(selectProperties)
  const loading  = useSelector(selectPropertyLoading)
  const { page, size, setPage } = usePagination(12)
  const [query,   setQuery]   = useState('')
  const [city,    setCity]    = useState('')
  const [type,    setType]    = useState('')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [sortBy,  setSortBy]  = useState('')
  const [cities,  setCities]  = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const debouncedQ = useDebounce(query)

  useEffect(() => {
    propertyService.getCities().then(r => setCities(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    dispatch(searchProperties({
      page, size,
      status: 'AVAILABLE',
      ...(debouncedQ && { name: debouncedQ }),
      ...(city    && { city }),
      ...(type    && { type }),
      ...(minRent && { minRent }),
      ...(maxRent && { maxRent }),
      ...(sortBy  && { sortBy }),
    }))
  }, [page, debouncedQ, city, type, minRent, maxRent, sortBy, dispatch])

  const clearFilters = () => {
    setCity(''); setType(''); setMinRent(''); setMaxRent(''); setSortBy('')
    setPage(0)
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Find a Property</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary btn-sm">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(0) }}
          className="input pl-11 py-3 text-base" placeholder="Search by property name…" />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="label">City</label>
            <select value={city} onChange={e => { setCity(e.target.value); setPage(0) }} className="input">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select value={type} onChange={e => { setType(e.target.value); setPage(0) }} className="input">
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Min Rent (₹)</label>
            <input type="number" className="input" value={minRent}
              onChange={e => { setMinRent(e.target.value); setPage(0) }} placeholder="0" />
          </div>
          <div>
            <label className="label">Max Rent (₹)</label>
            <input type="number" className="input" value={maxRent}
              onChange={e => { setMaxRent(e.target.value); setPage(0) }} placeholder="Any" />
          </div>
          <div>
            <label className="label">Sort By</label>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(0) }} className="input">
              <option value="">Newest</option>
              <option value="rentAsc">Rent: Low to High</option>
              <option value="rentDesc">Rent: High to Low</option>
            </select>
          </div>
          <div className="col-span-full">
            <button onClick={clearFilters} className="btn btn-secondary btn-sm">Clear Filters</button>
          </div>
        </div>
      )}

      {/* Results count */}
      {data && (
        <p className="text-sm text-neutral-500">
          {data.totalElements} propert{data.totalElements === 1 ? 'y' : 'ies'} found
        </p>
      )}

      {loading && !data ? <Spinner size="lg" className="h-64" /> : (
        <>
          {!data?.content?.length ? (
            <EmptyState title="No properties found" description="Try adjusting your search or filters." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.content.map(p => (
                  <Link key={p.id} to={`/properties/${p.id}`} className="card-hover group block">
                    <div className="h-44 bg-neutral-100 rounded-lg overflow-hidden mb-4">
                      {p.images?.find(i => i.isPrimary) || p.images?.[0]
                        ? <img src={(p.images.find(i => i.isPrimary) || p.images[0]).imageUrl}
                            alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <Building2 size={40} className="text-neutral-300" />
                          </div>
                      }
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900 truncate">{p.name}</h3>
                      <Badge value={p.availabilityStatus} />
                    </div>
                    <p className="text-sm text-neutral-500 truncate mb-3">{p.address}, {p.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold">
                        {fmtINR(p.rentAmount)}<span className="text-xs text-neutral-400 font-normal">/mo</span>
                      </span>
                      <span className="text-xs text-neutral-400">{p.numRooms} rooms · {p.propertyType}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  )
}