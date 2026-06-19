import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { agreementService } from '../../services/agreementService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchMyAgreements = createAsyncThunk(
  'agreements/fetchMine',
  async (params, { rejectWithValue }) => {
    try { const { data } = await agreementService.getMine(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load agreements') }
  }
)

export const fetchAgreementsByProperty = createAsyncThunk(
  'agreements/fetchByProperty',
  async ({ id, params }, { rejectWithValue }) => {
    try { const { data } = await agreementService.getByProperty(id, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load agreements') }
  }
)

export const fetchAgreementsByTenant = createAsyncThunk(
  'agreements/fetchByTenant',
  async ({ id, params }, { rejectWithValue }) => {
    try { const { data } = await agreementService.getByTenant(id, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load agreements') }
  }
)

export const fetchAgreementById = createAsyncThunk(
  'agreements/fetchById',
  async (id, { rejectWithValue }) => {
    try { const { data } = await agreementService.getById(id); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load agreement') }
  }
)

export const createAgreement = createAsyncThunk(
  'agreements/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await agreementService.create(payload)
      toast.success('Agreement created!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to create agreement') }
  }
)

export const terminateAgreement = createAsyncThunk(
  'agreements/terminate',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await agreementService.terminate(id)
      toast.success('Agreement terminated')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to terminate agreement') }
  }
)

export const renewAgreement = createAsyncThunk(
  'agreements/renew',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await agreementService.renew(id, payload)
      toast.success('Agreement renewed!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to renew agreement') }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const agreementSlice = createSlice({
  name: 'agreements',
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
    load(fetchMyAgreements)
    load(fetchAgreementsByProperty)
    load(fetchAgreementsByTenant)
    load(fetchAgreementById, 'current')
    load(createAgreement, 'current')
    load(terminateAgreement, 'current')
    load(renewAgreement, 'current')
  }
})

export const { clearCurrent, clearState } = agreementSlice.actions
export default agreementSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectAgreementList    = s => s.agreements.list
export const selectAgreementCurrent = s => s.agreements.current
export const selectAgreementLoading = s => s.agreements.loading
export const selectAgreementError   = s => s.agreements.error