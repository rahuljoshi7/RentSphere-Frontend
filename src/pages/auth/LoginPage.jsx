import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectAuthLoading, selectIsLoggedIn } from '../../redux/slices/authSlice'
import { LogIn } from 'lucide-react'

const schema = yup.object({
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required')
})

export default function LoginPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectAuthLoading)
  const isLoggedIn= useSelector(selectIsLoggedIn)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => { if (isLoggedIn) navigate('/dashboard', { replace: true }) }, [isLoggedIn, navigate])

  const onSubmit = (data) => dispatch(login(data))

  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h2>
      <p className="text-sm text-neutral-500 mb-6">Sign in to your RentSphere account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="label">Email address</label>
          <input {...register('email')} type="email" className={errors.email ? 'input-error' : 'input'}
            placeholder="you@example.com" autoFocus />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input {...register('password')} type="password" className={errors.password ? 'input-error' : 'input'}
            placeholder="••••••••" />
          {errors.password && <p className="error-msg">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center btn-lg mt-2">
          <LogIn size={18} />
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
      </p>
    </div>
  )
}
