import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { propertyService } from '../../services/propertyService'
import toast from 'react-hot-toast'

export const fetchProperties  = createAsyncThunk('properties/fetchAll',  async (params, { rejectWithValue }) => {
  try { const { data } = await propertyService.getAll(params); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const fetchMyProperties= createAsyncThunk('properties/fetchMine', async (params, { rejectWithValue }) => {
  try { const { data } = await propertyService.getMine(params); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const searchProperties = createAsyncThunk('properties/search',    async (params, { rejectWithValue }) => {
  try { const { data } = await propertyService.search(params); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const fetchPropertyById= createAsyncThunk('properties/fetchById', async (id, { rejectWithValue }) => {
  try { const { data } = await propertyService.getById(id); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const createProperty   = createAsyncThunk('properties/create',    async (payload, { rejectWithValue }) => {
  try { const { data } = await propertyService.create(payload); toast.success('Property created!'); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const updateProperty   = createAsyncThunk('properties/update',    async ({ id, data: payload }, { rejectWithValue }) => {
  try { const { data } = await propertyService.update(id, payload); toast.success('Property updated!'); return data } catch(e) { return rejectWithValue(e.userMessage) }
})
export const deleteProperty   = createAsyncThunk('properties/delete',    async (id, { rejectWithValue }) => {
  try { await propertyService.delete(id); toast.success('Property deleted'); return id } catch(e) { return rejectWithValue(e.userMessage) }
})

const propertySlice = createSlice({
  name: 'properties',
  initialState: { list: null, current: null, loading: false, error: null },
  reducers: { clearCurrent: s => { s.current = null } },
  extraReducers: b => {
    const load = (b, thunk, key = 'list') => {
      b.addCase(thunk.pending,   s => { s.loading = true; s.error = null })
      b.addCase(thunk.fulfilled, (s, { payload }) => { s.loading = false; s[key] = payload })
      b.addCase(thunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; if(payload) toast.error(payload) })
    }
    load(b, fetchProperties)
    load(b, fetchMyProperties)
    load(b, searchProperties)
    load(b, fetchPropertyById, 'current')
    load(b, createProperty, 'current')
    load(b, updateProperty, 'current')
    b.addCase(deleteProperty.fulfilled, (s, { payload }) => {
      s.loading = false
      if (s.list?.content) s.list.content = s.list.content.filter(p => p.id !== payload)
    })
  }
})
export const { clearCurrent } = propertySlice.actions
export default propertySlice.reducer
export const selectProperties   = s => s.properties.list
export const selectCurrentProp  = s => s.properties.current
export const selectPropertyLoading = s => s.properties.loading
