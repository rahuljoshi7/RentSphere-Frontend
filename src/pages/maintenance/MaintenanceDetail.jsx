import { useEffect, useState } from 'react'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function MaintenanceDetail() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Maintenance Detail</h1>
      </div>
      {loading ? <Spinner size="lg" className="h-48" /> : (
        <div className="card">
          <EmptyState title="Coming soon" description="This section is under construction." />
        </div>
      )}
    </div>
  )
}
