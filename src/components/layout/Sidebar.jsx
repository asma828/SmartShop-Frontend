import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAdmin, selectUser } from '@store/slices/authSlice'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  UserCircle,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'

function Sidebar({ isOpen, onClose }) {
  const isAdmin = useSelector(selectIsAdmin)
  const user = useSelector(selectUser)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
      show: isAdmin,
    },
    {
      name: 'Produits',
      href: '/products',
      icon: Package,
      show: true,
    },
    {
      name: 'Commandes',
      href: '/orders',
      icon: ShoppingCart,
      show: true,
    },
    {
      name: 'Paiements',
      href: '/payments',
      icon: CreditCard,
      show: true,
    },
    {
      name: 'Mon Profil',
      href: '/profile',
      icon: UserCircle,
      show: !isAdmin,
    },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-6 lg:hidden">
            <h2 className="text-xl font-display font-bold text-primary-600">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation
              .filter((item) => item.show)
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar