import { useSelector } from 'react-redux'
import { selectCurrentUser, selectUserRoles, selectIsLoggedIn } from '../redux/slices/authSlice'

export function useAuth() {
  const user      = useSelector(selectCurrentUser)
  const roles     = useSelector(selectUserRoles)
  const isLoggedIn= useSelector(selectIsLoggedIn)

  const hasRole   = (...check) => check.some(r => roles.includes(r))
  const isAdmin   = () => hasRole('ADMIN')
  const isOwner   = () => hasRole('PROPERTY_OWNER')
  const isManager = () => hasRole('PROPERTY_MANAGER')
  const isTenant  = () => hasRole('TENANT')
  const isStaff   = () => hasRole('MAINTENANCE_STAFF')

  return { user, roles, isLoggedIn, hasRole, isAdmin, isOwner, isManager, isTenant, isStaff }
}
