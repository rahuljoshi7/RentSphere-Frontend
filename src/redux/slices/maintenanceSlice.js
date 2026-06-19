import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { maintenanceService } from '../../services/maintenanceService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchMyMaintenance = createAsyncThunk(
  'maintenance/fetchMine',
  async (params, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getMine(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load requests') }
  }
)

export const fetchAssignedMaintenance = createAsyncThunk(
  'maintenance/fetchAssigned',
  async (params, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getAssigned(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load assigned requests') }
  }
)

export const fetchMaintenanceByProperty = createAsyncThunk(
  'maintenance/fetchByProperty',
  async ({ id, params }, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getByProperty(id, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load requests') }
  }
)

export const fetchMaintenanceByStatus = createAsyncThunk(
  'maintenance/fetchByStatus',
  async ({ status, params }, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getByStatus(status, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load requests') }
  }
)

export const fetchMaintenanceForOwner = createAsyncThunk(
  'maintenance/fetchForOwner',
  async (params, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getForOwner(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load requests') }
  }
)

export const fetchMaintenanceById = createAsyncThunk(
  'maintenance/fetchById',
  async (id, { rejectWithValue }) => {
    try { const { data } = await maintenanceService.getById(id); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load request') }
  }
)

export const createMaintenanceRequest = createAsyncThunk(
  'maintenance/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await maintenanceService.create(payload)
      toast.success('Maintenance request submitted!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to submit request') }
  }
)

export const updateMaintenanceStatus = createAsyncThunk(
  'maintenance/updateStatus',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await maintenanceService.updateStatus(id, payload)
      toast.success('Status updated!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to update status') }
  }
)

export const assignMaintenance = createAsyncThunk(
  'maintenance/assign',
  async ({ id, staffId }, { rejectWithValue }) => {
    try {
      const { data } = await maintenanceService.assign(id, staffId)
      toast.success('Assigned to staff!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to assign request') }
  }
)

export const closeMaintenance = createAsyncThunk(
  'maintenance/close',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await maintenanceService.close(id)
      toast.success('Request closed!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to close request') }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const maintenanceSlice = createSlice({
  name: 'maintenance',
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
    load(fetchMyMaintenance)
    load(fetchAssignedMaintenance)
    load(fetchMaintenanceByProperty)
    load(fetchMaintenanceByStatus)
    load(fetchMaintenanceForOwner)
    load(fetchMaintenanceById, 'current')
    load(createMaintenanceRequest, 'current')
    load(updateMaintenanceStatus, 'current')
    load(assignMaintenance, 'current')
    load(closeMaintenance, 'current')
  }
})

export const { clearCurrent, clearState } = maintenanceSlice.actions
export default maintenanceSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectMaintenanceList    = s => s.maintenance.list
export const selectMaintenanceCurrent = s => s.maintenance.current
export const selectMaintenanceLoading = s => s.maintenance.loading
export const selectMaintenanceError   = s => s.maintenance.error