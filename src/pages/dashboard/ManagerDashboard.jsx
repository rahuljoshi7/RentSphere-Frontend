import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Building2, Users, FileText, Wrench, CreditCard, Home } from 'lucide-react'
import { fetchManagerDashboard, selectManagerStats, selectDashboardLoad } from '../../redux/slices/dashboardSlice'
import StatCard from '../../components/common/StatCard'
import Spinner  from '../../components/common/Spinner'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

export default function ManagerDashboard() {
  const dispatch = useDispatch()
  const data     = useSelector(selectManagerStats)
  const loading  = useSelector(selectDashboardLoad)

  useEffect(() => { dispatch(fetchManagerDashboard()) }, [dispatch])

  if (loading && !data) return <Spinner size="lg" className="h-64" />
  if (!data)   return <p className="text-neutral-500 text-center py-16">Failed to load dashboard.</p>

  const radialData = [{ name: 'Occupancy', value: data.occupancyRate, fill: '#4F46E5' }]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="text-sm text-neutral-500">Properties under your management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Managed Properties" value={data.managedProperties}      icon={Building2}  color="blue"   />
        <StatCard label="Occupied"           value={data.occupiedProperties}     icon={Home}       color="green"  />
        <StatCard label="Vacant"             value={data.vacantProperties}       icon={Building2}  color="yellow" />
        <StatCard label="Active Tenants"     value={data.activeTenants}          icon={Users}      color="purple" />
        <StatCard label="Active Agreements"  value={data.activeAgreements}       icon={FileText}   color="blue"   />
        <StatCard label="Open Maintenance"   value={data.openMaintenanceRequests}icon={Wrench}     color="red"    />
        <StatCard label="Pending Payments"   value={data.pendingPayments}        icon={CreditCard} color="yellow" />
      </div>

      <div className="card flex flex-col items-center justify-center max-w-sm">
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
    </div>
  )
}
