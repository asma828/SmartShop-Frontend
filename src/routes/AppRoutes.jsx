import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@store/slices/authSlice'

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

// Product Pages
import ProductsListPage from '@pages/products/ProductsListPage'
import ProductFormPage from '@pages/products/ProductFormPage'
import ProductDetailPage from '@pages/products/ProductDetailPage'

// Order Pages
import OrdersListPage from '@pages/orders/OrdersListPage'
import CreateOrderPage from '@pages/orders/CreateOrderPage'
import OrderDetailPage from '@pages/orders/OrderDetailPage'

// Payment Pages
import PaymentsPage from '@pages/payments/PaymentsPage'

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

            {/* Product Management (Admin actions) */}
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />

            {/* Order Management (Admin actions) */}
            <Route path="/orders/new" element={<CreateOrderPage />} />
          </Route>

          {/* Product routes (accessible by all authenticated users) */}
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Order routes (accessible by all authenticated users) */}
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          {/* Payment routes (accessible by all authenticated users) */}
          <Route path="/payments" element={<PaymentsPage />} />

          {/* Client routes */}
          <Route path="/profile" element={<div>Profile Page</div>} />
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