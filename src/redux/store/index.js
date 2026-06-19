import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../slices/authSlice'
import propertyReducer from '../slices/propertySlice'
import tenantReducer from '../slices/tenantSlice'
import agreementReducer from '../slices/agreementSlice'
import paymentReducer from '../slices/paymentSlice'
import maintenanceReducer from '../slices/maintenanceSlice'
import notificationReducer from '../slices/notificationSlice'
import dashboardReducer from '../slices/dashboardSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    tenants: tenantReducer,
    agreements: agreementReducer,
    payments: paymentReducer,
    maintenance: maintenanceReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store