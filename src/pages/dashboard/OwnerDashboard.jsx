import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Building2, Users, TrendingUp, Home, DollarSign, CalendarClock } from 'lucide-react'
import {
  fetchOwnerDashboard, fetchOwnerAnalytics,
  selectOwnerStats, selectOwnerAnalytics, selectDashboardLoad
} from '../../redux/slices/dashboardSlice'
import StatCard from '../../components/common/StatCard'
import Spinner  from '../../components/common/Spinner'
import { fmtINR } from '../../utils/formatters'
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const PAYMENT_COLORS = { paid: '#10B981', pending: '#F59E0B', overdue: '#EF4444' }

export default function OwnerDashboard() {
  const dispatch  = useDispatch()
  const data      = useSelector(selectOwnerStats)
  const analytics = useSelector(selectOwnerAnalytics)
  const loading   = useSelector(selectDashboardLoad)

  useEffect(() => {
    dispatch(fetchOwnerDashboard())
    dispatch(fetchOwnerAnalytics())
  }, [dispatch])

  if (loading && !data) return <Spinner size="lg" className="h-64" />
  if (!data)   return <p className="text-neutral-500 text-center py-16">Failed to load dashboard.</p>

  const radialData = [{ name: 'Occupancy', value: data.occupancyRate, fill: '#4F46E5' }]

  const paymentPieData = analytics ? [
    { name: 'Paid',    value: analytics.paymentStatusBreakdown.paid,    fill: PAYMENT_COLORS.paid },
    { name: 'Pending', value: analytics.paymentStatusBreakdown.pending, fill: PAYMENT_COLORS.pending },
    { name: 'Overdue', value: analytics.paymentStatusBreakdown.overdue, fill: PAYMENT_COLORS.overdue }
  ].filter(d => d.value > 0) : []

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Portfolio</h1>
        <p className="text-sm text-neutral-500">Your property overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Properties"    value={data.totalProperties}    icon={Building2}  color="blue"   />
        <StatCard label="Occupied"            value={data.occupiedProperties} icon={Home}       color="green"  />
        <StatCard label="Vacant"              value={data.vacantProperties}   icon={Building2}  color="yellow" />
        <StatCard label="Active Tenants"      value={data.totalTenants}       icon={Users}      color="purple" />
        <StatCard label="Monthly Revenue"     value={fmtINR(data.monthlyRevenue)} icon={TrendingUp} color="green" />
        <StatCard label="Yearly Revenue"      value={fmtINR(data.yearlyRevenue)}  icon={DollarSign} color="blue"  />
      </div>

      {analytics && (
        <div className="card border-l-4 border-l-warning-500 flex items-center gap-3">
          <CalendarClock className="text-warning-600 flex-shrink-0" size={22} />
          <p className="text-sm text-neutral-700">
            <span className="font-semibold">{analytics.agreementsExpiringSoon}</span> of your agreement(s) expiring in the next 30 days.
          </p>
        </div>
      )}

      {/* Occupancy rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center justify-center">
          <h3 className="mb-2">Occupancy Rate</h3>
          <div className="relative">
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <Tooltip formatter={v => `${v}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{data.occupancyRate}%</span>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="mb-4">Revenue Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'This Month', value: data.monthlyRevenue, color: 'bg-primary-600' },
              { label: 'This Year',  value: data.yearlyRevenue,  color: 'bg-success-500'  }
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">{label}</span>
                  <span className="font-semibold">{fmtINR(value)}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`}
                    style={{ width: `${Math.min(100, (value / (data.yearlyRevenue || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {analytics && (
        <>
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

            <div className="card">
              <h3 className="mb-4">Top Properties by Revenue</h3>
              {analytics.topProperties.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-neutral-500 border-b border-neutral-100">
                        <th className="py-2 pr-4">Property</th>
                        <th className="py-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topProperties.map(p => (
                        <tr key={p.propertyId} className="border-b border-neutral-50">
                          <td className="py-2 pr-4 font-medium text-neutral-800">{p.propertyName}</td>
                          <td className="py-2 text-right font-semibold text-neutral-800">{fmtINR(p.totalRevenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-neutral-500 text-sm py-8 text-center">No revenue recorded yet.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
