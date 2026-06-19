import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { propertyService } from '../../services/propertyService'
import { PROPERTY_TYPES } from '../../utils/formatters'
import toast from 'react-hot-toast'
import { useState } from 'react'

const schema = yup.object({
  name: yup.string().required('Name is required').max(200),
  propertyType: yup.string().required('Type is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required').max(100),
  state: yup.string().required('State is required').max(100),
  rentAmount: yup.number().positive('Must be positive').required('Rent is required'),
  depositAmount: yup.number().min(0).required('Deposit is required'),
  numRooms: yup.number().integer().positive().required('Rooms required'),
  description: yup.string().nullable()
})

export default function EditPropertyPage() {
  const navigate  = useNavigate()
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const res = await propertyService.create(data)
      toast.success('Property created!')
      navigate(`/properties/${res.data.id}`)
    } catch (e) {
      toast.error(e.userMessage || 'Failed to create property')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl">
      <div className="page-header"><h1 className="page-title">Edit Property</h1></div>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <label className="label">Property Name</label>
            <input {...register('name')} className={errors.name ? 'input-error' : 'input'} placeholder="e.g. Sunshine Apartments 2B" />
            {errors.name && <p className="error-msg">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label">Property Type</label>
              <select {...register('propertyType')} className={errors.propertyType ? 'input-error' : 'input'}>
                <option value="">Select type</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.propertyType && <p className="error-msg">{errors.propertyType.message}</p>}
            </div>
            <div className="form-group mb-0">
              <label className="label">Number of Rooms</label>
              <input {...register('numRooms')} type="number" min="1" className={errors.numRooms ? 'input-error' : 'input'} />
              {errors.numRooms && <p className="error-msg">{errors.numRooms.message}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="label">Address</label>
            <input {...register('address')} className={errors.address ? 'input-error' : 'input'} placeholder="Full street address" />
            {errors.address && <p className="error-msg">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label">City</label>
              <input {...register('city')} className={errors.city ? 'input-error' : 'input'} placeholder="Pune" />
              {errors.city && <p className="error-msg">{errors.city.message}</p>}
            </div>
            <div className="form-group mb-0">
              <label className="label">State</label>
              <input {...register('state')} className={errors.state ? 'input-error' : 'input'} placeholder="Maharashtra" />
              {errors.state && <p className="error-msg">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label">Monthly Rent (₹)</label>
              <input {...register('rentAmount')} type="number" step="0.01" className={errors.rentAmount ? 'input-error' : 'input'} placeholder="15000" />
              {errors.rentAmount && <p className="error-msg">{errors.rentAmount.message}</p>}
            </div>
            <div className="form-group mb-0">
              <label className="label">Security Deposit (₹)</label>
              <input {...register('depositAmount')} type="number" step="0.01" className={errors.depositAmount ? 'input-error' : 'input'} placeholder="30000" />
              {errors.depositAmount && <p className="error-msg">{errors.depositAmount.message}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description (optional)</label>
            <textarea {...register('description')} rows={3} className="input" placeholder="Additional details about the property…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving ? 'Saving…' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
