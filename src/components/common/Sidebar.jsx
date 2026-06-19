import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logout } from '../../redux/slices/authSlice'
import {
  LayoutDashboard, Building2, Users, FileText,
  CreditCard, Wrench, Layers, BarChart3,
  Bell, Shield, LogOut, X
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard, roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT','MAINTENANCE_STAFF'] },
  { to: '/properties',    label: 'Properties',   icon: Building2,       roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT'] },
  { to: '/tenants',       label: 'Tenants',      icon: Users,           roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER'] },
  { to: '/agreements',    label: 'Agreements',   icon: FileText,        roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT'] },
  { to: '/payments',      label: 'Payments',     icon: CreditCard,      roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT'] },
  { to: '/maintenance',   label: 'Maintenance',  icon: Wrench,          roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT','MAINTENANCE_STAFF'] },
  { to: '/facilities',    label: 'Facilities',   icon: Layers,          roles: ['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER','TENANT'] },
  { to: '/reports',       label: 'Reports',      icon: BarChart3,       roles: ['ADMIN','PROPERTY_OWNER'] },
  { to: '/admin/users',   label: 'Users',        icon: Shield,          roles: ['ADMIN'] },
]

export default function Sidebar({ onClose }) {
  const dispatch  = useDispatch()
  const user      = useSelector(selectCurrentUser)
  const userRoles = user?.roles || []

  const visible = NAV.filter(item => item.roles.some(r => userRoles.includes(r)))

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-lg">🏢</div>
          <span className="font-bold text-lg tracking-tight">RentSphere</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-neutral-400 hover:text-white p-1">
          <X size={20} />
        </button>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-neutral-400 truncate">{userRoles[0]?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {visible.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-neutral-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
