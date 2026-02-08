import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsAdmin } from '@store/slices/authSlice'

// Layouts
import MainLayout from '@components/layout/MainLayout'

// Pages
import LoginPage from '@pages/auth/LoginPage'
import DashboardPage from '@pages/DashboardPage'
import NotFoundPage from '@pages/NotFoundPage'

// Client Pages
import ClientsListPage from '@pages/clients/ClientsListPage'
import ClientFormPage from '@pages/clients/ClientFormPage'
import ClientProfilePage from '@pages/clients/ClientProfilePage'

// Route guards
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

function AppRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Admin only routes */}
          <Route element={<AdminRoute />}>
            {/* Client Management */}
            <Route path="/clients" element={<ClientsListPage />} />
            <Route path="/clients/new" element={<ClientFormPage />} />
            <Route path="/clients/:id" element={<ClientProfilePage />} />
            <Route path="/clients/:id/edit" element={<ClientFormPage />} />
          </Route>

          {/* Client routes */}
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/orders" element={<div>Orders Page</div>} />
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/payments" element={<div>Payments Page</div>} />
        </Route>
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes