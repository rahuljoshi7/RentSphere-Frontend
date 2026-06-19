import { format, parseISO } from 'date-fns'

// ── Date ──────────────────────────────────────────────────────────────────
export const fmtDate   = (d) => d ? format(typeof d === 'string' ? parseISO(d) : new Date(d), 'dd MMM yyyy') : '—'
export const fmtDateTime=(d) => d ? format(typeof d === 'string' ? parseISO(d) : new Date(d), 'dd MMM yyyy, hh:mm a') : '—'

// ── Currency ──────────────────────────────────────────────────────────────
export const fmtINR = (amount) =>
  amount != null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
    : '—'

// ── String ────────────────────────────────────────────────────────────────
export const titleCase  = (s) => s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) ?? ''
export const initials   = (name) => name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() ?? 'U'
export const truncate   = (s, n = 60) => s?.length > n ? s.slice(0, n) + '…' : s ?? ''

// ── Month labels ──────────────────────────────────────────────────────────
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const monthLabel = (m) => MONTHS[(m - 1)] ?? m

// ── Role helpers ──────────────────────────────────────────────────────────
export const ROLE_LABELS = {
  ADMIN:             'Administrator',
  PROPERTY_OWNER:    'Property Owner',
  PROPERTY_MANAGER:  'Property Manager',
  TENANT:            'Tenant',
  MAINTENANCE_STAFF: 'Maintenance Staff'
}

// ── Property types ────────────────────────────────────────────────────────
export const PROPERTY_TYPES     = ['APARTMENT','VILLA','HOUSE','COMMERCIAL','OFFICE','SHOP']
export const AVAILABILITY_STATUSES = ['AVAILABLE','OCCUPIED','UNDER_MAINTENANCE']
export const PAYMENT_STATUSES   = ['PENDING','PAID','OVERDUE']
export const AGREEMENT_STATUSES = ['ACTIVE','EXPIRED','TERMINATED','RENEWED']
export const MAINTENANCE_STATUSES= ['OPEN','ASSIGNED','IN_PROGRESS','COMPLETED']
export const FACILITY_TYPES     = ['PARKING','SECURITY','WATER_SUPPLY','ELECTRICITY','HOUSEKEEPING']
export const PRIORITIES         = ['LOW','MEDIUM','HIGH','URGENT']

// ── Pagination helper ─────────────────────────────────────────────────────
export const buildPageParams = (page, size, extra = {}) => ({ page, size, ...extra })
