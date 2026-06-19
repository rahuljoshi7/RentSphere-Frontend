import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { paymentService } from '../../services/paymentService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchMyPayments = createAsyncThunk(
  'payments/fetchMine',
  async (params, { rejectWithValue }) => {
    try { const { data } = await paymentService.getMine(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load payments') }
  }
)

export const fetchPaymentsByTenant = createAsyncThunk(
  'payments/fetchByTenant',
  async ({ tenantId, params }, { rejectWithValue }) => {
    try { const { data } = await paymentService.getByTenant(tenantId, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load payments') }
  }
)

export const fetchPaymentsByAgreement = createAsyncThunk(
  'payments/fetchByAgreement',
  async ({ agreementId, params }, { rejectWithValue }) => {
    try { const { data } = await paymentService.getByAgreement(agreementId, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load payments') }
  }
)

export const fetchPaymentsByStatus = createAsyncThunk(
  'payments/fetchByStatus',
  async ({ status, params }, { rejectWithValue }) => {
    try { const { data } = await paymentService.getByStatus(status, params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load payments') }
  }
)

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try { const { data } = await paymentService.getById(id); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load payment') }
  }
)

export const recordPayment = createAsyncThunk(
  'payments/record',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await paymentService.record(id, payload)
      toast.success('Payment recorded!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to record payment') }
  }
)

export const generatePayment = createAsyncThunk(
  'payments/generate',
  async ({ agreementId, month, year }, { rejectWithValue }) => {
    try {
      const { data } = await paymentService.generate(agreementId, month, year)
      toast.success('Payment entry generated!')
      return data
    } catch (e) { return rejectWithValue(e.userMessage || 'Failed to generate payment') }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const paymentSlice = createSlice({
  name: 'payments',
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
    load(fetchMyPayments)
    load(fetchPaymentsByTenant)
    load(fetchPaymentsByAgreement)
    load(fetchPaymentsByStatus)
    load(fetchPaymentById, 'current')
    load(recordPayment, 'current')
    load(generatePayment, 'current')
  }
})

export const { clearCurrent, clearState } = paymentSlice.actions
export default paymentSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectPaymentList    = s => s.payments.list
export const selectPaymentCurrent = s => s.payments.current
export const selectPaymentLoading = s => s.payments.loading
export const selectPaymentError   = s => s.payments.error