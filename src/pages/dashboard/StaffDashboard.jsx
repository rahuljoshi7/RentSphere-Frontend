import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Wrench, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { fetchStaffDashboard, selectStaffStats, selectDashboardLoad } from '../../redux/slices/dashboardSlice'
import StatCard from '../../components/common/StatCard'
import Spinner  from '../../components/common/Spinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PRIORITY_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Urgent: '#EF4444' }

export default function StaffDashboard() {
  const dispatch = useDispatch()
  const data     = useSelector(selectStaffStats)
  const loading  = useSelector(selectDashboardLoad)

  useEffect(() => { dispatch(fetchStaffDashboard()) }, [dispatch])

  if (loading && !data) return <Spinner size="lg" className="h-64" />
  if (!data)   return <p className="text-neutral-500 text-center py-16">Failed to load dashboard.</p>

  const priorityData = [
    { name: 'Low',    value: data.priorityBreakdown.low },
    { name: 'Medium', value: data.priorityBreakdown.medium },
    { name: 'High',   value: data.priorityBreakdown.high },
    { name: 'Urgent', value: data.priorityBreakdown.urgent }
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Work Queue</h1>
        <p className="text-sm text-neutral-500">Maintenance requests assigned to you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assigned" value={data.totalAssigned}   icon={Wrench}       color="blue"   />
        <StatCard label="Open / Assigned"value={data.openCount}       icon={Clock}        color="yellow" />
        <StatCard label="In Progress"    value={data.inProgressCount} icon={Loader2}      color="purple" />
        <StatCard label="Completed"      value={data.completedCount}  icon={CheckCircle2} color="green"  />
      </div>

      <div className="card">
        <h3 className="mb-4">Assigned Requests by Priority</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4,4,0,0]}>
              {priorityData.map((d, i) => <Cell key={i} fill={PRIORITY_COLORS[d.name]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <Link to="/maintenance" className="btn btn-primary">View All Assigned Requests</Link>
      </div>
    </div>
  )
}
