import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tenantService } from '../../services/tenantService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchAllTenants = createAsyncThunk(
  'tenants/fetchAll',
  async (params, { rejectWithValue }) => {
    try { const { data } = await tenantService.getAll(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load tenants') }
  }
)

export const fetchMyTenants = createAsyncThunk(
  'tenants/fetchForOwner',
  async (params, { rejectWithValue }) => {
    try { const { data } = await tenantService.getForOwner(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load tenants') }
  }
)

export const fetchTenantById = createAsyncThunk(
  'tenants/fetchById',
  async (id, { rejectWithValue }) => {
    try { const { data } = await tenantService.getById(id); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load tenant') }
  }
)

export const fetchMyProfile = createAsyncThunk(
  'tenants/fetchMe',
  async (_, { rejectWithValue }) => {
    try { const { data } = await tenantService.getMe(); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load profile') }
  }
)

export const searchTenants = createAsyncThunk(
  'tenants/search',
  async ({ q, params }, { rejectWithValue }) => {
    try { const { data } = await tenantService.search(q, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Search failed') }
  }
)

export const updateTenantProfile = createAsyncThunk(
  'tenants/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await tenantService.updateProfile(id, payload)
      toast.success('Profile updated!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to update profile') }
  }
)

export const deactivateTenant = createAsyncThunk(
  'tenants/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      await tenantService.deactivate(id)
      toast.success('Tenant deactivated')
      return id
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to deactivate') }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const tenantSlice = createSlice({
  name: 'tenants',
  initialState: { list: null, current: null, loading: false, error: null },
  reducers: {
    clearCurrent: s => { s.current = null },
    clearState:   s => { s.list = null; s.current = null; s.loading = false; s.error = null }
  },
  extraReducers: b => {
    const load = (thunk, key = 'list') => {
      b.addCase(thunk.pending,   s => { s.loading = true; s.error = null })
      b.addCase(thunk.fulfilled, (s, { payload }) => { s.loading = false; s[key] = payload })
      b.addCase(thunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; if (payload) toast.error(payload) })
    }
    load(fetchAllTenants)
    load(fetchMyTenants)
    load(fetchTenantById, 'current')
    load(fetchMyProfile, 'current')
    load(searchTenants)
    load(updateTenantProfile, 'current')
    b.addCase(deactivateTenant.fulfilled, (s, { payload }) => {
      s.loading = false
      if (s.list?.content) s.list.content = s.list.content.filter(t => t.id !== payload)
    })
    b.addCase(deactivateTenant.rejected, (s, { payload }) => {
      s.loading = false; if (payload) toast.error(payload)
    })
  }
})

export const { clearCurrent, clearState } = tenantSlice.actions
export default tenantSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectTenantList    = s => s.tenants.list
export const selectTenantCurrent = s => s.tenants.current
export const selectTenantLoading = s => s.tenants.loading
export const selectTenantError   = s => s.tenants.error