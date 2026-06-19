export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">RentSphere</h1>
          <p className="text-primary-200 mt-1 text-sm">Property & Facility Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </div>

        <p className="text-center text-primary-200 text-xs mt-6">
          © {new Date().getFullYear()} RentSphere. All rights reserved.
        </p>
      </div>
    </div>
  )
}
