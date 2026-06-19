import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createMaintenanceRequest } from '../../redux/slices/maintenanceSlice'
import { selectMaintenanceLoading } from '../../redux/slices/maintenanceSlice'
import { PRIORITIES } from '../../utils/formatters'
import { useEffect, useState } from 'react'
import { propertyService } from '../../services/propertyService'

const schema = yup.object({
  propertyId:  yup.number().required('Property is required'),
  title:       yup.string().required('Title is required').max(200),
  description: yup.string().required('Description is required'),
  priority:    yup.string().required('Priority is required'),
})

export default function CreateMaintenance() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectMaintenanceLoading)
  const [properties, setProperties] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    // Tenants fetch their rented properties
    propertyService.getAll({ page: 0, size: 50 })
      .then(r => setProperties(r.data.content || []))
      .catch(() => {})
  }, [])

  const onSubmit = (data) => {
    dispatch(createMaintenanceRequest(data)).unwrap()
      .then(res => navigate(`/maintenance/${res.id}`))
      .catch(() => {})
  }

  return (
    <div className="max-w-2xl">
      <div className="page-header"><h1 className="page-title">Raise Maintenance Request</h1></div>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="form-group">
            <label className="label">Property</label>
            <select {...register('propertyId', { valueAsNumber: true })} className={errors.propertyId ? 'input-error' : 'input'}>
              <option value="">Select property</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.propertyId && <p className="error-msg">{errors.propertyId.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Title</label>
            <input {...register('title')} className={errors.title ? 'input-error' : 'input'}
              placeholder="e.g. Leaking kitchen tap" />
            {errors.title && <p className="error-msg">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Priority</label>
            <select {...register('priority')} className={errors.priority ? 'input-error' : 'input'}>
              <option value="">Select priority</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.priority && <p className="error-msg">{errors.priority.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea {...register('description')} rows={5} className={errors.description ? 'input-error' : 'input'}
              placeholder="Describe the issue in detail — location, when it started, any safety concern…" />
            {errors.description && <p className="error-msg">{errors.description.message}</p>}
          </div>

          <p className="text-xs text-neutral-400">You can attach a photo after submission from the request detail page.</p>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}