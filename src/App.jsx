import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { loadUserFromStorage } from './redux/slices/authSlice'

export default function App() {
  const dispatch = useDispatch()

  // Rehydrate auth state on page refresh
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
