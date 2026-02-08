import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { selectIsAuthenticated, getCurrentUser } from '@store/slices/authSlice'

function PrivateRoute() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est toujours connecté au chargement
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await dispatch(getCurrentUser()).unwrap()
        } catch (error) {
          console.log('User not authenticated')
        }
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [dispatch, isAuthenticated])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute