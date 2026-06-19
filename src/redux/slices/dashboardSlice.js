import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardService } from '../../services/dashboardService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getAdmin(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load admin dashboard') }
  }
)

export const fetchAdminAnalytics = createAsyncThunk(
  'dashboard/fetchAdminAnalytics',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getAdminAnalytics(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load admin analytics') }
  }
)

export const fetchOwnerDashboard = createAsyncThunk(
  'dashboard/fetchOwner',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getOwner(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load owner dashboard') }
  }
)

export const fetchOwnerAnalytics = createAsyncThunk(
  'dashboard/fetchOwnerAnalytics',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getOwnerAnalytics(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load owner analytics') }
  }
)

export const fetchManagerDashboard = createAsyncThunk(
  'dashboard/fetchManager',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getManager(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load manager dashboard') }
  }
)

export const fetchTenantDashboard = createAsyncThunk(
  'dashboard/fetchTenant',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getTenant(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load tenant dashboard') }
  }
)

export const fetchStaffDashboard = createAsyncThunk(
  'dashboard/fetchStaff',
  async (_, { rejectWithValue }) => {
    try { const { data } = await dashboardService.getStaff(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load staff dashboard') }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    adminStats:     null,   // { totalProperties, occupiedProperties, vacantProperties, totalTenants, monthlyRevenue, pendingPayments, ... }
    adminAnalytics: null,   // { revenueTrend, paymentStatusBreakdown, maintenancePriorityBreakdown, topProperties, agreementsExpiringSoon }
    ownerStats:     null,   // { totalProperties, occupiedProperties, vacantProperties, totalTenants, monthlyRevenue, yearlyRevenue, occupancyRate }
    ownerAnalytics: null,   // { revenueTrend, paymentStatusBreakdown, topProperties, agreementsExpiringSoon }
    managerStats:   null,   // { managedProperties, occupiedProperties, vacantProperties, activeTenants, activeAgreements, openMaintenanceRequests, pendingPayments, occupancyRate }
    tenantStats:    null,   // { activePropertyName, agreementEndDate, monthlyRent, pendingPayments, totalDue, openMaintenanceRequests, totalMaintenanceRequests, agreementExpiringSoon }
    staffStats:     null,   // { totalAssigned, openCount, inProgressCount, completedCount, priorityBreakdown }
    loading:        false,
    error:          null
  },
  reducers: {
    clearDashboardError: s => { s.error = null }
  },
  extraReducers: b => {
    b.addCase(fetchAdminDashboard.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchAdminDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.adminStats = payload })
    b.addCase(fetchAdminDashboard.rejected,  (s, { payload }) => {
      s.loading = false; s.error = payload
      if (payload) toast.error(payload)
    })

    b.addCase(fetchAdminAnalytics.fulfilled, (s, { payload }) => { s.adminAnalytics = payload })
    b.addCase(fetchAdminAnalytics.rejected,  (s, { payload }) => { if (payload) toast.error(payload) })

    b.addCase(fetchOwnerDashboard.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchOwnerDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.ownerStats = payload })
    b.addCase(fetchOwnerDashboard.rejected,  (s, { payload }) => {
      s.loading = false; s.error = payload
      if (payload) toast.error(payload)
    })

    b.addCase(fetchOwnerAnalytics.fulfilled, (s, { payload }) => { s.ownerAnalytics = payload })
    b.addCase(fetchOwnerAnalytics.rejected,  (s, { payload }) => { if (payload) toast.error(payload) })

    b.addCase(fetchManagerDashboard.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchManagerDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.managerStats = payload })
    b.addCase(fetchManagerDashboard.rejected,  (s, { payload }) => {
      s.loading = false; s.error = payload
      if (payload) toast.error(payload)
    })

    b.addCase(fetchTenantDashboard.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchTenantDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.tenantStats = payload })
    b.addCase(fetchTenantDashboard.rejected,  (s, { payload }) => {
      s.loading = false; s.error = payload
      if (payload) toast.error(payload)
    })

    b.addCase(fetchStaffDashboard.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchStaffDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.staffStats = payload })
    b.addCase(fetchStaffDashboard.rejected,  (s, { payload }) => {
      s.loading = false; s.error = payload
      if (payload) toast.error(payload)
    })
  }
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectAdminStats      = s => s.dashboard.adminStats
export const selectAdminAnalytics  = s => s.dashboard.adminAnalytics
export const selectOwnerStats      = s => s.dashboard.ownerStats
export const selectOwnerAnalytics  = s => s.dashboard.ownerAnalytics
export const selectManagerStats    = s => s.dashboard.managerStats
export const selectTenantStats     = s => s.dashboard.tenantStats
export const selectStaffStats      = s => s.dashboard.staffStats
export const selectDashboardLoad   = s => s.dashboard.loading
export const selectDashboardError  = s => s.dashboard.error
