import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createAgreement } from '../../redux/slices/agreementSlice'
import { selectAgreementLoading } from '../../redux/slices/agreementSlice'
import { useState, useEffect } from 'react'
import { propertyService } from '../../services/propertyService'
import { tenantService }   from '../../services/tenantService'

const schema = yup.object({
  propertyId:      yup.number().required('Property is required'),
  tenantId:        yup.number().required('Tenant is required'),
  startDate:       yup.string().required('Start date is required'),
  endDate:         yup.string().required('End date is required'),
  monthlyRent:     yup.number().positive('Must be positive').required('Monthly rent is required'),
  securityDeposit: yup.number().min(0).required('Security deposit is required'),
})

export default function CreateAgreement() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectAgreementLoading)
  const [properties, setProperties] = useState([])
  const [tenants,    setTenants]    = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    propertyService.getAll({ page: 0, size: 100, status: 'AVAILABLE' })
      .then(r => setProperties(r.data.content || []))
      .catch(() => {})
    tenantService.getAll({ page: 0, size: 100 })
      .then(r => setTenants(r.data.content || []))
      .catch(() => {})
  }, [])

  const onSubmit = (data) => {
    dispatch(createAgreement(data)).unwrap()
      .then(res => navigate(`/agreements/${res.id}`))
      .catch(() => {})
  }

  return (
    <div className="max-w-2xl">
      <div className="page-header"><h1 className="page-title">Create Agreement</h1></div>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="form-group">
            <label className="label">Property</label>
            <select {...register('propertyId', { valueAsNumber: true })} className={errors.propertyId ? 'input-error' : 'input'}>
              <option value="">Select a property</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
            </select>
            {errors.propertyId && <p className="error-msg">{errors.propertyId.message}</p>}
          </div>

          <div className="form-group">
            <label className="label">Tenant</label>
            <select {...register('tenantId', { valueAsNumber: true })} className={errors.tenantId ? 'input-error' : 'input'}>
              <option value="">Select a tenant</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>)}
            </select>
            {errors.tenantId && <p className="error-msg">{errors.tenantId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label">Start Date</label>
              <input type="date" {...register('startDate')} className={errors.startDate ? 'input-error' : 'input'} />
              {errors.startDate && <p className="error-msg">{errors.startDate.message}</p>}
            </div>
            <div className="form-group mb-0">
              <label className="label">End Date</label>
              <input type="date" {...register('endDate')} className={errors.endDate ? 'input-error' : 'input'} />
              {errors.endDate && <p className="error-msg">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="label">Monthly Rent (₹)</label>
              <input type="number" step="0.01" {...register('monthlyRent', { valueAsNumber: true })}
                className={errors.monthlyRent ? 'input-error' : 'input'} placeholder="15000" />
              {errors.monthlyRent && <p className="error-msg">{errors.monthlyRent.message}</p>}
            </div>
            <div className="form-group mb-0">
              <label className="label">Security Deposit (₹)</label>
              <input type="number" step="0.01" {...register('securityDeposit', { valueAsNumber: true })}
                className={errors.securityDeposit ? 'input-error' : 'input'} placeholder="30000" />
              {errors.securityDeposit && <p className="error-msg">{errors.securityDeposit.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Creating…' : 'Create Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}