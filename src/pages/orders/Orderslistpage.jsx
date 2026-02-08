import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllOrders,
  selectPaginatedOrders,
  selectOrdersLoading,
  selectOrderFilters,
  setFilters,
  resetFilters,
  setPage,
  setItemsPerPage,
} from '@store/slices/orderSlice'
import { selectIsAdmin } from '@store/slices/authSlice'
import { Plus, Eye, Filter, ShoppingCart, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@utils/formatUtils'
import Pagination from '@components/common/Pagination'
import ItemsPerPageSelector from '@components/common/ItemsPerPageSelector'

function OrdersListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, totalItems, totalPages, currentPage, itemsPerPage } = useSelector(selectPaginatedOrders)
  const isLoading = useSelector(selectOrdersLoading)
  const filters = useSelector(selectOrderFilters)
  const isAdmin = useSelector(selectIsAdmin)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(setPage(page))
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { icon: Clock, text: 'En attente', class: 'badge badge-warning' },
      CONFIRMED: { icon: CheckCircle, text: 'Confirmée', class: 'badge badge-success' },
      CANCELED: { icon: XCircle, text: 'Annulée', class: 'badge bg-gray-500 text-white' },
      REJECTED: { icon: AlertCircle, text: 'Rejetée', class: 'badge badge-danger' },
    }
    return badges[status] || badges.PENDING
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Gestion des Commandes
          </h1>
          <p className="text-gray-600 mt-1">
            {totalItems} commande{totalItems > 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate('/orders/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Commande
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        {/* Items per page selector */}
        <div className="flex justify-end">
          <ItemsPerPageSelector
            value={itemsPerPage}
            onChange={(value) => dispatch(setItemsPerPage(value))}
          />
        </div>

        {/* Status filters */}
        <div>
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
            <Filter className="w-5 h-5" />
            <span>Filtrer par statut</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => dispatch(setFilters({ status: 'all' }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({totalItems})
            </button>
            <button
              onClick={() => dispatch(setFilters({ status: 'PENDING' }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'PENDING'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => dispatch(setFilters({ status: 'CONFIRMED' }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'CONFIRMED'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => dispatch(setFilters({ status: 'CANCELED' }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'CANCELED'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulées
            </button>
            <button
              onClick={() => dispatch(setFilters({ status: 'REJECTED' }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'REJECTED'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetées
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {totalItems === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune commande trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.status !== 'all'
              ? 'Aucune commande ne correspond à ce statut'
              : 'Commencez par créer votre première commande'}
          </p>
          {filters.status === 'all' && isAdmin && (
            <button
              onClick={() => navigate('/orders/new')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer une commande
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={order.id}
                  className="card p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Commande #{order.id}</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {order.clientNom}
                      </div>
                    </div>
                    <div className={statusInfo.class}>
                      <StatusIcon className="w-4 h-4 inline mr-1" />
                      {statusInfo.text}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Articles:</span>
                      <span className="font-medium">{order.items?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total TTC:</span>
                      <span className="font-bold text-primary-600">
                        {formatCurrency(order.totalTTC)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Montant payé:</span>
                      <span className={order.montantRestant === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                        {formatCurrency(order.montantPaye)}
                      </span>
                    </div>
                    {order.montantRestant > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Restant:</span>
                        <span className="text-red-600 font-medium">
                          {formatCurrency(order.montantRestant)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card overflow-hidden">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrdersListPage