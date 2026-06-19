import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Home, CalendarClock, CreditCard, Wrench, AlertTriangle } from 'lucide-react'
import { fetchTenantDashboard, selectTenantStats, selectDashboardLoad } from '../../redux/slices/dashboardSlice'
import StatCard from '../../components/common/StatCard'
import Spinner  from '../../components/common/Spinner'
import { fmtINR, fmtDate } from '../../utils/formatters'

export default function TenantDashboard() {
  const dispatch = useDispatch()
  const data     = useSelector(selectTenantStats)
  const loading  = useSelector(selectDashboardLoad)

  useEffect(() => { dispatch(fetchTenantDashboard()) }, [dispatch])

  if (loading && !data) return <Spinner size="lg" className="h-64" />
  if (!data)   return <p className="text-neutral-500 text-center py-16">Failed to load dashboard.</p>

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <p className="text-sm text-neutral-500">Your lease, payments and requests at a glance</p>
      </div>

      {data.agreementExpiringSoon && (
        <div className="card border-l-4 border-l-warning-500 flex items-center gap-3">
          <AlertTriangle className="text-warning-600 flex-shrink-0" size={22} />
          <p className="text-sm text-neutral-700">
            Your agreement ends on <span className="font-semibold">{fmtDate(data.agreementEndDate)}</span> — consider renewing soon.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Current Property"  value={data.activePropertyName || '—'}     icon={Home}        color="blue"   />
        <StatCard label="Monthly Rent"      value={fmtINR(data.monthlyRent)}           icon={CreditCard}  color="purple" />
        <StatCard label="Agreement Ends"    value={fmtDate(data.agreementEndDate)}     icon={CalendarClock} color="yellow" />
        <StatCard label="Pending Payments"  value={data.pendingPayments}               icon={CreditCard}  color="red"    />
        <StatCard label="Total Due"         value={fmtINR(data.totalDue)}              icon={CreditCard}  color="yellow" />
        <StatCard label="Open Maintenance"  value={data.openMaintenanceRequests}       icon={Wrench}      color="green"  />
      </div>

      <div className="card flex flex-wrap gap-3">
        <Link to="/payments" className="btn btn-primary">View Payments</Link>
        <Link to="/maintenance/new" className="btn btn-secondary">Raise Maintenance Request</Link>
        <Link to="/agreements" className="btn btn-secondary">View Agreement</Link>
      </div>
    </div>
  )
}
