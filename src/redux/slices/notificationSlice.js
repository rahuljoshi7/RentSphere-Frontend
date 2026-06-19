import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationService } from '../../services/notificationService'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params, { rejectWithValue }) => {
    try { const { data } = await notificationService.getAll(params); return data }
    catch (e) { return rejectWithValue(e.userMessage || 'Failed to load notifications') }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnread',
  async (_, { rejectWithValue }) => {
    try { const { data } = await notificationService.getUnreadCount(); return data }
    catch (e) { return rejectWithValue(null) }
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try { await notificationService.markRead(id); return id }
    catch (e) { return rejectWithValue(e.userMessage) }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllRead()
      toast.success('All notifications marked as read')
      return true
    } catch (e) { return rejectWithValue(e.userMessage) }
  }
)

// ── Slice ───────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: null, unreadCount: 0, loading: false, error: null },
  reducers: {
    clearState: s => { s.list = null; s.unreadCount = 0; s.loading = false; s.error = null }
  },
  extraReducers: b => {
    b.addCase(fetchNotifications.pending,   s => { s.loading = true; s.error = null })
    b.addCase(fetchNotifications.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload })
    b.addCase(fetchNotifications.rejected,  (s, { payload }) => { s.loading = false; s.error = payload })

    b.addCase(fetchUnreadCount.fulfilled, (s, { payload }) => { s.unreadCount = payload ?? 0 })

    b.addCase(markNotificationRead.fulfilled, (s, { payload }) => {
      if (s.list?.content) {
        const n = s.list.content.find(n => n.id === payload)
        if (n && !n.isRead) { n.isRead = true; s.unreadCount = Math.max(0, s.unreadCount - 1) }
      }
    })

    b.addCase(markAllNotificationsRead.fulfilled, s => {
      if (s.list?.content) s.list.content.forEach(n => { n.isRead = true })
      s.unreadCount = 0
    })
  }
})

export const { clearState } = notificationSlice.actions
export default notificationSlice.reducer

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectNotificationList  = s => s.notifications.list
export const selectUnreadCount       = s => s.notifications.unreadCount
export const selectNotificationLoad  = s => s.notifications.loading