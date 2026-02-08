import { useSelector } from 'react-redux'
import { selectUser, selectIsAdmin } from '@store/slices/authSlice'
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'

function DashboardPage() {
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)

  // Mock data - à remplacer par de vraies données API
  const stats = [
    {
      name: 'Total Clients',
      value: '156',
      icon: Users,
      color: 'bg-blue-500',
      show: isAdmin,
    },
    {
      name: 'Produits',
      value: '89',
      icon: Package,
      color: 'bg-green-500',
      show: true,
    },
    {
      name: 'Commandes',
      value: '234',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      show: true,
    },
    {
      name: 'Chiffre d\'affaires',
      value: '245,890 DH',
      icon: TrendingUp,
      color: 'bg-orange-500',
      show: isAdmin,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-display font-bold mb-2">
          Bienvenue, {user?.username} !
        </h1>
        <p className="text-primary-100">
          {isAdmin
            ? 'Tableau de bord administrateur'
            : 'Gérez vos commandes et suivez votre programme de fidélité'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats
          .filter((stat) => stat.show)
          .map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="btn-primary text-left p-4 flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <span>Nouvelle commande</span>
          </button>
          {isAdmin && (
            <>
              <button className="btn-secondary text-left p-4 flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Ajouter un client</span>
              </button>
              <button className="btn-secondary text-left p-4 flex items-center gap-3">
                <Package className="w-5 h-5" />
                <span>Ajouter un produit</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Activité récente
        </h2>
        <div className="space-y-3">
          <p className="text-gray-500 text-center py-8">
            Aucune activité récente
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage