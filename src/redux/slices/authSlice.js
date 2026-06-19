import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

// ── Thunks ─────────────────────────────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials)
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  } catch (err) {
    return rejectWithValue(err.userMessage || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(payload)
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  } catch (err) {
    return rejectWithValue(err.userMessage || 'Registration failed')
  }
})

export const loadUserFromStorage = createAsyncThunk('auth/loadFromStorage', async () => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

// ── Slice ──────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      null,
    token:     localStorage.getItem('token') || null,
    loading:   false,
    error:     null,
    isLoggedIn:false
  },
  reducers: {
    logout(state) {
      state.user      = null
      state.token     = null
      state.isLoggedIn= false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Logged out successfully')
    },
    clearError(state) { state.error = null }
  },
  extraReducers: builder => {
    // ── login ──
    builder.addCase(login.pending,   s => { s.loading = true; s.error = null })
    builder.addCase(login.fulfilled, (s, { payload }) => {
      s.loading   = false
      s.user      = payload
      s.token     = payload.accessToken
      s.isLoggedIn= true
    })
    builder.addCase(login.rejected,  (s, { payload }) => {
      s.loading = false
      s.error   = payload
      toast.error(payload)
    })
    // ── register ──
    builder.addCase(register.pending,   s => { s.loading = true; s.error = null })
    builder.addCase(register.fulfilled, (s, { payload }) => {
      s.loading   = false
      s.user      = payload
      s.token     = payload.accessToken
      s.isLoggedIn= true
    })
    builder.addCase(register.rejected,  (s, { payload }) => {
      s.loading = false
      s.error   = payload
      toast.error(payload)
    })
    // ── load from storage ──
    builder.addCase(loadUserFromStorage.fulfilled, (s, { payload }) => {
      if (payload) { s.user = payload; s.isLoggedIn = true; s.token = payload.accessToken }
    })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectCurrentUser  = s => s.auth.user
export const selectIsLoggedIn   = s => s.auth.isLoggedIn
export const selectAuthLoading  = s => s.auth.loading
export const selectAuthError    = s => s.auth.error
export const selectUserRoles    = s => s.auth.user?.roles || []
export const selectHasRole      = role => s => (s.auth.user?.roles || []).includes(role)
