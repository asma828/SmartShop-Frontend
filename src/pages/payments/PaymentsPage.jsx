import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, selectOrders } from '@store/slices/orderSlice'
import { selectIsAdmin } from '@store/slices/authSlice'
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '@utils/formatUtils'

function PaymentsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orders = useSelector(selectOrders)
  const isAdmin = useSelector(selectIsAdmin)
  const [statusFilter, setStatusFilter] = useState('all') // all, paid, partial, unpaid

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  // Extract all payments from all orders
  const getAllPayments = () => {
    const payments = []
    orders.forEach(order => {
      if (order.payments && order.payments.length > 0) {
        order.payments.forEach(payment => {
          payments.push({
            ...payment,
            orderId: order.id,
            clientNom: order.clientNom,
            orderStatus: order.status,
          })
        })
      }
    })
    return payments.sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
  }

  // Filter orders by payment status
  const filterOrders = () => {
    let filtered = [...orders]

    if (statusFilter === 'paid') {
      filtered = filtered.filter(o => o.montantRestant === 0)
    } else if (statusFilter === 'partial') {
      filtered = filtered.filter(o => o.montantPaye > 0 && o.montantRestant > 0)
    } else if (statusFilter === 'unpaid') {
      filtered = filtered.filter(o => o.montantPaye === 0 && o.montantRestant > 0)
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const allPayments = getAllPayments()
  const filteredOrders = filterOrders()

  // Calculate statistics
  const stats = {
    totalPaid: orders.reduce((sum, o) => sum + (o.montantPaye || 0), 0),
    totalUnpaid: orders.reduce((sum, o) => sum + (o.montantRestant || 0), 0),
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.montantRestant === 0).length,
    partialOrders: orders.filter(o => o.montantPaye > 0 && o.montantRestant > 0).length,
    unpaidOrders: orders.filter(o => o.montantPaye === 0 && o.montantRestant > 0).length,
    totalPayments: allPayments.length,
  }

  const getPaymentTypeBadge = (type) => {
    const badges = {
      ESPECES: { text: 'Espèces', class: 'badge badge-success' },
      CHEQUE: { text: 'Chèque', class: 'badge badge-warning' },
      VIREMENT: { text: 'Virement', class: 'badge bg-blue-500 text-white' },
    }
    return badges[type] || badges.ESPECES
  }

  const getPaymentStatusBadge = (status) => {
    const badges = {
      ENCAISSE: { icon: CheckCircle, text: 'Encaissé', class: 'badge badge-success' },
      EN_ATTENTE: { icon: Clock, text: 'En attente', class: 'badge badge-warning' },
      REJETE: { icon: XCircle, text: 'Rejeté', class: 'badge badge-danger' },
    }
    return badges[status] || badges.EN_ATTENTE
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Gestion des Paiements
        </h1>
        <p className="text-gray-600 mt-1">
          Suivi complet des paiements et encaissements
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Paid */}
        <div className="card p-5 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Total Encaissé</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-700">
            {stats.paidOrders} commandes payées
          </p>
        </div>

        {/* Total Unpaid */}
        <div className="card p-5 bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-700 font-medium">Total Restant</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(stats.totalUnpaid)}
              </p>
            </div>
          </div>
          <p className="text-xs text-red-700">
            {stats.unpaidOrders} non payées, {stats.partialOrders} partielles
          </p>
        </div>

        {/* Total Payments Count */}
        <div className="card p-5 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Transactions</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalPayments}
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-700">
            Paiements enregistrés
          </p>
        </div>

        {/* Revenue */}
        <div className="card p-5 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(stats.totalPaid + stats.totalUnpaid)}
              </p>
            </div>
          </div>
          <p className="text-xs text-purple-700">
            {stats.totalOrders} commandes au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
          <Filter className="w-5 h-5" />
          <span>Filtrer par statut de paiement</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'paid'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payées ({stats.paidOrders})
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'partial'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Partielles ({stats.partialOrders})
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'unpaid'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Non payées ({stats.unpaidOrders})
          </button>
        </div>
      </div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Orders with Payment Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary-600" />
            Commandes ({filteredOrders.length})
          </h2>

          {filteredOrders.length === 0 ? (
            <div className="card p-8 text-center">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isPaid = order.montantRestant === 0
                const isPartial = order.montantPaye > 0 && order.montantRestant > 0
                const isUnpaid = order.montantPaye === 0

                return (
                  <div
                    key={order.id}
                    className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Commande #{order.id}</div>
                        <div className="font-bold text-gray-900">{order.clientNom}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isPaid && (
                          <span className="badge badge-success">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Payée
                          </span>
                        )}
                        {isPartial && (
                          <span className="badge badge-warning">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Partielle
                          </span>
                        )}
                        {isUnpaid && (
                          <span className="badge badge-danger">
                            <XCircle className="w-3 h-3 inline mr-1" />
                            Non payée
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <div className="font-semibold">{formatCurrency(order.totalTTC)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Payé:</span>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(order.montantPaye)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Restant:</span>
                        <div className="font-semibold text-red-600">
                          {formatCurrency(order.montantRestant)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Recent Payments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-600" />
            Paiements Récents ({allPayments.length})
          </h2>

          {allPayments.length === 0 ? (
            <div className="card p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun paiement enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allPayments.slice(0, 10).map((payment) => {
                const typeBadge = getPaymentTypeBadge(payment.typePaiement)
                const statusBadge = getPaymentStatusBadge(payment.status)
                const StatusIcon = statusBadge.icon

                return (
                  <div
                    key={payment.id}
                    className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/orders/${payment.orderId}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-500">
                          Paiement #{payment.numeroPaiement}
                        </div>
                        <div className="font-bold text-gray-900">
                          {payment.clientNom}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Commande #{payment.orderId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600">
                          {formatCurrency(payment.montant)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={typeBadge.class}>{typeBadge.text}</span>
                      <span className={statusBadge.class}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(payment.datePaiement)}
                      </div>
                      {payment.dateEcheance && (
                        <div className="text-xs text-gray-500">
                          Échéance: {formatDate(payment.dateEcheance)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage