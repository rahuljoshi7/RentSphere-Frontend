import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Building2, Users, CreditCard, AlertCircle, TrendingUp, Home, FileText, Wrench, CalendarClock } from 'lucide-react'
import {
  fetchAdminDashboard, fetchAdminAnalytics,
  selectAdminStats, selectAdminAnalytics, selectDashboardLoad
} from '../../redux/slices/dashboardSlice'
import StatCard from '../../components/common/StatCard'
import Spinner  from '../../components/common/Spinner'
import { fmtINR } from '../../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'

const PIE_COLORS     = ['#4F46E5', '#10B981', '#F59E0B']
const PAYMENT_COLORS = { paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444' }
const PRIORITY_COLORS= { low: '#10B981', medium: '#F59E0B', high: '#F97316', urgent: '#EF4444' }

export default function AdminDashboard() {
  const dispatch  = useDispatch()
  const data      = useSelector(selectAdminStats)
  const analytics = useSelector(selectAdminAnalytics)
  const loading   = useSelector(selectDashboardLoad)

  useEffect(() => {
    dispatch(fetchAdminDashboard())
    dispatch(fetchAdminAnalytics())
  }, [dispatch])

  if (loading && !data) return <Spinner size="lg" className="h-64" />
  if (!data)   return <p className="text-neutral-500 text-center py-16">Failed to load dashboard.</p>

  const pieData = [
    { name: 'Occupied', value: data.occupiedProperties },
    { name: 'Vacant',   value: data.vacantProperties   },
    { name: 'Maintenance', value: data.totalProperties - data.occupiedProperties - data.vacantProperties }
  ].filter(d => d.value > 0)

  const paymentPieData = analytics ? [
    { name: 'Paid',    value: analytics.paymentStatusBreakdown.paid,    fill: PAYMENT_COLORS.paid },
    { name: 'Pending', value: analytics.paymentStatusBreakdown.pending, fill: PAYMENT_COLORS.pending },
    { name: 'Overdue', value: analytics.paymentStatusBreakdown.overdue, fill: PAYMENT_COLORS.overdue }
  ].filter(d => d.value > 0) : []

  const priorityBarData = analytics ? [
    { name: 'Low',    value: analytics.maintenancePriorityBreakdown.low,    fill: PRIORITY_COLORS.low },
    { name: 'Medium', value: analytics.maintenancePriorityBreakdown.medium, fill: PRIORITY_COLORS.medium },
    { name: 'High',   value: analytics.maintenancePriorityBreakdown.high,   fill: PRIORITY_COLORS.high },
    { name: 'Urgent', value: analytics.maintenancePriorityBreakdown.urgent, fill: PRIORITY_COLORS.urgent }
  ] : []

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-sm text-neutral-500">Platform-wide overview</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Properties"    value={data.totalProperties}    icon={Building2}  color="blue"   />
        <StatCard label="Active Tenants"      value={data.totalTenants}       icon={Users}      color="green"  />
        <StatCard label="Monthly Revenue"     value={fmtINR(data.monthlyRevenue)} icon={TrendingUp} color="purple" />
        <StatCard label="Pending Payments"    value={data.pendingPayments}    icon={CreditCard} color="yellow" />
        <StatCard label="Active Agreements"   value={data.activeAgreements}   icon={FileText}   color="blue"   />
        <StatCard label="Open Maintenance"    value={data.openMaintenanceRequests} icon={Wrench} color="red"  />
        <StatCard label="Occupied Properties" value={data.occupiedProperties} icon={Home}       color="green"  />
        <StatCard label="Vacant Properties"   value={data.vacantProperties}   icon={AlertCircle} color="yellow" />
      </div>

      {analytics && (
        <div className="card border-l-4 border-l-warning-500 flex items-center gap-3">
          <CalendarClock className="text-warning-600 flex-shrink-0" size={22} />
          <p className="text-sm text-neutral-700">
            <span className="font-semibold">{analytics.agreementsExpiringSoon}</span> agreement(s) expiring in the next 30 days.
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property status pie */}
        <div className="card">
          <h3 className="mb-4">Property Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats bar */}
        <div className="card">
          <h3 className="mb-4">At a Glance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { name: 'Properties', value: data.totalProperties },
              { name: 'Tenants',    value: data.totalTenants    },
              { name: 'Agreements', value: data.activeAgreements},
              { name: 'Pending',    value: data.pendingPayments },
              { name: 'Open Maint', value: data.openMaintenanceRequests }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {analytics && (
        <>
          {/* Revenue trend */}
          <div className="card">
            <h3 className="mb-4">Revenue Trend (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => fmtINR(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment status breakdown */}
            <div className="card">
              <h3 className="mb-4">Payment Status Breakdown</h3>
              {paymentPieData.length ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={paymentPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {paymentPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-neutral-500 text-sm py-16 text-center">No payment data yet.</p>}
            </div>

            {/* Maintenance priority breakdown */}
            <div className="card">
              <h3 className="mb-4">Maintenance Requests by Priority</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priorityBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {priorityBarData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top properties */}
          <div className="card">
            <h3 className="mb-4">Top 5 Properties by Revenue</h3>
            {analytics.topProperties.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500 border-b border-neutral-100">
                      <th className="py-2 pr-4">Property</th>
                      <th className="py-2 pr-4">City</th>
                      <th className="py-2 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProperties.map(p => (
                      <tr key={p.propertyId} className="border-b border-neutral-50">
                        <td className="py-2 pr-4 font-medium text-neutral-800">{p.propertyName}</td>
                        <td className="py-2 pr-4 text-neutral-500">{p.city}</td>
                        <td className="py-2 text-right font-semibold text-neutral-800">{fmtINR(p.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-neutral-500 text-sm py-8 text-center">No revenue recorded yet.</p>}
          </div>
        </>
      )}
    </div>
  )
}
