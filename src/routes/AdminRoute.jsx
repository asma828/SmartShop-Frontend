import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '@store/slices/authSlice'

function AdminRoute() {
  const isAdmin = useSelector(selectIsAdmin)

  if (!isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ error: 'Accès refusé. Vous devez être administrateur.' }}
      />
    )
  }

  return <Outlet />
}

export default AdminRoute