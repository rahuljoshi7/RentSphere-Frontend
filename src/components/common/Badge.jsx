import clsx from 'clsx'

const VARIANTS = {
  AVAILABLE:       'badge-green',
  OCCUPIED:        'badge-red',
  UNDER_MAINTENANCE:'badge-yellow',
  ACTIVE:          'badge-green',
  EXPIRED:         'badge-gray',
  TERMINATED:      'badge-red',
  RENEWED:         'badge-blue',
  PAID:            'badge-green',
  PENDING:         'badge-yellow',
  OVERDUE:         'badge-red',
  OPEN:            'badge-blue',
  ASSIGNED:        'badge-purple',
  IN_PROGRESS:     'badge-yellow',
  COMPLETED:       'badge-green',
  RESOLVED:        'badge-green',
  LOW:             'badge-gray',
  MEDIUM:          'badge-blue',
  HIGH:            'badge-yellow',
  URGENT:          'badge-red'
}

export default function Badge({ value }) {
  const cls = VARIANTS[value] || 'badge-gray'
  return (
    <span className={clsx('badge', cls)}>
      {value?.replace(/_/g, ' ')}
    </span>
  )
}
