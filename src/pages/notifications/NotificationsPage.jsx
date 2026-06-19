import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, CheckCheck, Check } from 'lucide-react'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  selectNotificationList,
  selectNotificationLoad,
  selectUnreadCount,
} from '../../redux/slices/notificationSlice'
import Spinner    from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { fmtDateTime } from '../../utils/formatters'

const TYPE_COLOR = {
  PAYMENT:     'bg-success-100 text-success-700',
  MAINTENANCE: 'bg-warning-100 text-warning-700',
  AGREEMENT:   'bg-primary-100 text-primary-700',
  SYSTEM:      'bg-neutral-100 text-neutral-600',
}

export default function NotificationsPage() {
  const dispatch    = useDispatch()
  const list        = useSelector(selectNotificationList)
  const loading     = useSelector(selectNotificationLoad)
  const unreadCount = useSelector(selectUnreadCount)
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchNotifications({ page, size: 15 }))
  }, [dispatch, page])

  const handleMarkRead = (id, isRead) => {
    if (!isRead) dispatch(markNotificationRead(id))
  }

  const handleMarkAll = () => dispatch(markAllNotificationsRead())

  const notifications = list?.content ?? []
  const totalPages    = list?.totalPages ?? 0

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Bell size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-neutral-500">{unreadCount} unread</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="btn btn-secondary btn-sm flex items-center gap-1.5"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {loading && !list ? (
        <Spinner />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up — nothing new here."
        />
      ) : (
        <div className="card divide-y divide-neutral-100">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => handleMarkRead(n.id, n.isRead)}
              className={`w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-neutral-50 transition-colors ${
                !n.isRead ? 'bg-primary-50/40' : ''
              }`}
            >
              {/* Unread dot */}
              <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${n.isRead ? 'bg-transparent' : 'bg-primary-500'}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  {n.type && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[n.type] ?? TYPE_COLOR.SYSTEM}`}>
                      {n.type}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 ml-auto">{fmtDateTime(n.createdAt)}</span>
                </div>
                <p className={`text-sm ${n.isRead ? 'text-neutral-600' : 'text-neutral-900 font-medium'}`}>
                  {n.message}
                </p>
              </div>

              {n.isRead && (
                <Check size={14} className="mt-1 text-neutral-300 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
