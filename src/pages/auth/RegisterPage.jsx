import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { register as registerUser, selectAuthLoading, selectIsLoggedIn } from '../../redux/slices/authSlice'
import { UserPlus } from 'lucide-react'
import { ROLE_LABELS } from '../../utils/formatters'

const ROLES = ['PROPERTY_OWNER','PROPERTY_MANAGER','TENANT','MAINTENANCE_STAFF']

const schema = yup.object({
  firstName: yup.string().required('First name is required').max(100),
  lastName:  yup.string().required('Last name is required').max(100),
  email:     yup.string().email('Invalid email').required('Email is required'),
  phone:     yup.string().max(20).nullable(),
  password:  yup.string().min(8, 'Min 8 characters').required('Password is required'),
  role:      yup.string().oneOf(ROLES, 'Select a valid role').required('Role is required')
})

export default function RegisterPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectAuthLoading)
  const isLoggedIn= useSelector(selectIsLoggedIn)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'TENANT' }
  })

  useEffect(() => { if (isLoggedIn) navigate('/dashboard', { replace: true }) }, [isLoggedIn, navigate])

  const onSubmit = (data) => dispatch(registerUser(data))

  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-1">Create account</h2>
      <p className="text-sm text-neutral-500 mb-6">Join RentSphere today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="form-group mb-0">
            <label className="label">First Name</label>
            <input {...register('firstName')} className={errors.firstName ? 'input-error' : 'input'} placeholder="John" />
            {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
          </div>
          <div className="form-group mb-0">
            <label className="label">Last Name</label>
            <input {...register('lastName')} className={errors.lastName ? 'input-error' : 'input'} placeholder="Doe" />
            {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Email address</label>
          <input {...register('email')} type="email" className={errors.email ? 'input-error' : 'input'} placeholder="you@example.com" />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className="label">Phone (optional)</label>
          <input {...register('phone')} className="input" placeholder="+91 98765 43210" />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input {...register('password')} type="password" className={errors.password ? 'input-error' : 'input'} placeholder="Min 8 characters" />
          {errors.password && <p className="error-msg">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label className="label">Role</label>
          <select {...register('role')} className={errors.role ? 'input-error' : 'input'}>
            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          {errors.role && <p className="error-msg">{errors.role.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center btn-lg">
          <UserPlus size={18} />
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
