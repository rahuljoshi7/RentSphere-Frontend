import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Edit2, Trash2, Building2, MapPin, BedDouble, DollarSign, Image } from 'lucide-react'
import { useAuth }          from '../../hooks/useAuth'
import { propertyService }  from '../../services/propertyService'
import Spinner              from '../../components/common/Spinner'
import Badge                from '../../components/common/Badge'
import ConfirmModal         from '../../components/common/ConfirmModal'
import { fmtINR, fmtDate, titleCase } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function PropertyDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { isAdmin, isOwner, isManager } = useAuth()
  const [property,  setProperty]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [deleting,  setDeleting]  = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const canManage = isAdmin() || isOwner() || isManager()

  useEffect(() => {
    propertyService.getById(id)
      .then(r => setProperty(r.data))
      .catch(() => toast.error('Failed to load property'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await propertyService.delete(id)
      toast.success('Property deleted')
      navigate('/properties')
    } catch {
      toast.error('Failed to delete property')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  if (loading) return <Spinner size="lg" className="h-64" />
  if (!property) return <p className="text-center text-neutral-500 py-16">Property not found.</p>

  const images = property.images || []

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="page-header flex-wrap gap-3">
        <div>
          <h1 className="page-title">{property.name}</h1>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {property.address}, {property.city}, {property.state}
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Link to={`/properties/${id}/edit`} className="btn btn-secondary">
              <Edit2 size={15} /> Edit
            </Link>
            <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Images */}
        <div className="lg:col-span-3 space-y-3">
          <div className="h-72 bg-neutral-100 rounded-xl overflow-hidden">
            {images.length > 0
              ? <img src={images[activeImg]?.imageUrl} alt={property.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Building2 size={48} className="text-neutral-300" /></div>
            }
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary-600' : 'border-transparent'}`}>
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary-600">{fmtINR(property.rentAmount)}<span className="text-sm text-neutral-400 font-normal">/mo</span></span>
              <Badge value={property.availabilityStatus} />
            </div>

            {[
              { label: 'Type',        value: titleCase(property.propertyType) },
              { label: 'Rooms',       value: property.numRooms },
              { label: 'Deposit',     value: fmtINR(property.depositAmount) },
              { label: 'Owner',       value: property.ownerName },
              { label: 'Manager',     value: property.managerName || '—' },
              { label: 'Listed on',   value: fmtDate(property.createdAt) }
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                <span className="text-neutral-500">{label}</span>
                <span className="font-medium text-neutral-900">{value}</span>
              </div>
            ))}
          </div>

          {property.description && (
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold text-neutral-500 uppercase tracking-wide">Description</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">{property.description}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Delete Property"
        message={`Are you sure you want to delete "${property.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
      />
    </div>
  )
}
