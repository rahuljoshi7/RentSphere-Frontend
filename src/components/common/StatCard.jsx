import clsx from 'clsx'

const COLORS = {
  blue:   'bg-secondary-50 text-secondary-600',
  green:  'bg-success-50  text-success-600',
  yellow: 'bg-warning-50  text-warning-600',
  red:    'bg-danger-50   text-danger-600',
  purple: 'bg-primary-50  text-primary-600'
}

export default function StatCard({ label, value, icon: Icon, color = 'blue', suffix = '' }) {
  return (
    <div className="stat-card">
      <div className={clsx('stat-icon', COLORS[color])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="stat-value">{value ?? '—'}{suffix}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}
