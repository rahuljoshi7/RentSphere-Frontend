import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation }  from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'
import { selectCurrentUser }  from '../../redux/slices/authSlice'
import { notificationService } from '../../services/notificationService'

function breadcrumb(pathname) {
  return pathname.split('/').filter(Boolean).map(s =>
    s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')
  ).join(' › ')
}

export default function Topbar({ onMenuClick }) {
  const user     = useSelector(selectCurrentUser)
  const location = useLocation()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!user) return
    notificationService.getUnreadCount()
      .then(({ data }) => setUnread(data))
      .catch(() => {})
  }, [user, location.pathname])

  return (
    <header className="bg-white border-b border-neutral-200 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">

      {/* Mobile hamburger */}
      <button onClick={onMenuClick} className="lg:hidden text-neutral-500 hover:text-neutral-800 p-1">
        <Menu size={22} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-500 truncate">
          {breadcrumb(location.pathname) || 'Dashboard'}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Link to="/notifications" className="relative p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.fullName?.[0] || 'U'}
        </div>
      </div>
    </header>
  )
}
