import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUserRoles } from '../redux/slices/authSlice'

// Layouts
import MainLayout   from '../layouts/MainLayout'
import AuthLayout   from '../layouts/AuthLayout'

// Auth pages
import LoginPage    from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard
import AdminDashboard   from '../pages/dashboard/AdminDashboard'
import OwnerDashboard   from '../pages/dashboard/OwnerDashboard'
import ManagerDashboard from '../pages/dashboard/ManagerDashboard'
import TenantDashboard  from '../pages/dashboard/TenantDashboard'
import StaffDashboard   from '../pages/dashboard/StaffDashboard'

// Properties
import PropertiesPage     from '../pages/properties/PropertiesPage'
import PropertyDetailPage from '../pages/properties/PropertyDetailPage'
import CreatePropertyPage from '../pages/properties/CreatePropertyPage'
import EditPropertyPage   from '../pages/properties/EditPropertyPage'
import SearchPage         from '../pages/properties/SearchPage'

// Tenants
import TenantsPage   from '../pages/tenants/TenantsPage'
import TenantProfile from '../pages/tenants/TenantProfile'

// Agreements
import AgreementsPage  from '../pages/agreements/AgreementsPage'
import AgreementDetail from '../pages/agreements/AgreementDetail'
import CreateAgreement from '../pages/agreements/CreateAgreement'

// Payments
import PaymentsPage  from '../pages/payments/PaymentsPage'
import PaymentDetail from '../pages/payments/PaymentDetail'

// Maintenance
import MaintenancePage   from '../pages/maintenance/MaintenancePage'
import MaintenanceDetail from '../pages/maintenance/MaintenanceDetail'
import CreateMaintenance from '../pages/maintenance/CreateMaintenance'

// Facilities
import FacilitiesPage from '../pages/facilities/FacilitiesPage'

// Reports
import ReportsPage from '../pages/reports/ReportsPage'

// Admin
import AdminUsersPage from '../pages/admin/AdminUsersPage'

// Notifications
import NotificationsPage from '../pages/notifications/NotificationsPage'

// ── Guards ─────────────────────────────────────────────────────────────────

function PrivateRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function RoleRoute({ children, roles }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const userRoles  = useSelector(selectUserRoles)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  const allowed = roles.some(r => userRoles.includes(r))
  return allowed ? children : <Navigate to="/dashboard" replace />
}

function GuestRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />
}

// ── Smart dashboard redirect based on role ──────────────────────────────────
// Priority order matters when a user carries multiple roles: ADMIN > OWNER > MANAGER > STAFF > TENANT.

function DashboardRedirect() {
  const roles = useSelector(selectUserRoles)
  if (roles.includes('ADMIN'))              return <AdminDashboard />
  if (roles.includes('PROPERTY_OWNER'))     return <OwnerDashboard />
  if (roles.includes('PROPERTY_MANAGER'))   return <ManagerDashboard />
  if (roles.includes('MAINTENANCE_STAFF'))  return <StaffDashboard />
  if (roles.includes('TENANT'))             return <TenantDashboard />
  return <TenantDashboard />
}

// ── Routes ─────────────────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public / Guest */}
      <Route path="/login"    element={<GuestRoute><AuthLayout><LoginPage /></AuthLayout></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><AuthLayout><RegisterPage /></AuthLayout></GuestRoute>} />
      <Route path="/properties/search" element={<MainLayout><SearchPage /></MainLayout>} />

      {/* Protected */}
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index                element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"     element={<DashboardRedirect />} />

        {/* Notifications */}
        <Route path="notifications" element={<NotificationsPage />} />

        {/* Properties */}
        <Route path="properties"          element={<PropertiesPage />} />
        <Route path="properties/new"      element={<RoleRoute roles={['ADMIN','PROPERTY_OWNER']}><CreatePropertyPage /></RoleRoute>} />
        <Route path="properties/:id"      element={<PropertyDetailPage />} />
        <Route path="properties/:id/edit" element={<RoleRoute roles={['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER']}><EditPropertyPage /></RoleRoute>} />

        {/* Tenants */}
        <Route path="tenants"     element={<RoleRoute roles={['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER']}><TenantsPage /></RoleRoute>} />
        <Route path="tenants/:id" element={<TenantProfile />} />

        {/* Agreements */}
        <Route path="agreements"     element={<AgreementsPage />} />
        <Route path="agreements/new" element={<RoleRoute roles={['ADMIN','PROPERTY_OWNER','PROPERTY_MANAGER']}><CreateAgreement /></RoleRoute>} />
        <Route path="agreements/:id" element={<AgreementDetail />} />

        {/* Payments */}
        <Route path="payments"     element={<PaymentsPage />} />
        <Route path="payments/:id" element={<PaymentDetail />} />

        {/* Maintenance */}
        <Route path="maintenance"     element={<MaintenancePage />} />
        <Route path="maintenance/new" element={<RoleRoute roles={['TENANT']}><CreateMaintenance /></RoleRoute>} />
        <Route path="maintenance/:id" element={<MaintenanceDetail />} />

        {/* Facilities */}
        <Route path="facilities" element={<FacilitiesPage />} />

        {/* Reports */}
        <Route path="reports" element={<RoleRoute roles={['ADMIN','PROPERTY_OWNER']}><ReportsPage /></RoleRoute>} />

        {/* Admin */}
        <Route path="admin/users" element={<RoleRoute roles={['ADMIN']}><AdminUsersPage /></RoleRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
