import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOrderById,
  selectCurrentOrder,
  selectOrdersLoading,
  clearCurrentOrder,
  confirmOrder,
  cancelOrder,
} from '@store/slices/orderSlice'
import { fetchPaymentsByOrder, selectPayments, clearPayments } from '@store/slices/paymentSlice'
import { selectIsAdmin } from '@store/slices/authSlice'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  User,
  Calendar,
  DollarSign,
  Award,
  Tag,
} from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime } from '@utils/formatUtils'
import toast from 'react-hot-toast'
import PaymentDialog from '@components/orders/PaymentDialog'
import { useState } from 'react'

function OrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const order = useSelector(selectCurrentOrder)
  const payments = useSelector(selectPayments)
  const isLoading = useSelector(selectOrdersLoading)
  const isAdmin = useSelector(selectIsAdmin)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id))
      dispatch(fetchPaymentsByOrder(id))
    }

    return () => {
      dispatch(clearCurrentOrder())
      dispatch(clearPayments())
    }
  }, [dispatch, id])

  const handleConfirm = async () => {
    if (!window.confirm('Confirmer cette commande ?')) return

    try {
      await dispatch(confirmOrder(id)).unwrap()
      toast.success('Commande confirmée avec succès')
    } catch (error) {
      toast.error(error || 'Erreur lors de la confirmation')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Annuler cette commande ?')) return

    try {
      await dispatch(cancelOrder(id)).unwrap()
      toast.success('Commande annulée')
    } catch (error) {
      toast.error(error || 'Erreur lors de l\'annulation')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: 'En attente', class: 'badge badge-warning' },
      CONFIRMED: { text: 'Confirmée', class: 'badge badge-success' },
      CANCELED: { text: 'Annulée', class: 'badge bg-gray-500 text-white' },
      REJECTED: { text: 'Rejetée', class: 'badge badge-danger' },
    }
    return badges[status] || badges.PENDING
  }

  if (isLoading && !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Commande introuvable</p>
        <button onClick={() => navigate('/orders')} className="btn-primary mt-4">
          Retour à la liste
        </button>
      </div>
    )
  }

  const statusBadge = getStatusBadge(order.status)
  const isFullyPaid = order.montantRestant === 0
  const canConfirm = order.status === 'PENDING' && isFullyPaid
  const canCancel = order.status === 'PENDING'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Commande #{order.id}
            </h1>
            <p className="text-gray-600 mt-1">Détails complets de la commande</p>
          </div>
        </div>
        <div className={statusBadge.class + ' text-lg'}>
          {statusBadge.text}
        </div>
      </div>

      {/* Actions */}
      {isAdmin && (
        <div className="card p-4 flex gap-3">
          {canConfirm && (
            <button onClick={handleConfirm} className="btn-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Confirmer la commande
            </button>
          )}
          {canCancel && (
            <button onClick={handleCancel} className="btn-danger flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Annuler la commande
            </button>
          )}
          {order.status === 'PENDING' && !isFullyPaid && (
            <button
              onClick={() => setShowPaymentDialog(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Ajouter un paiement
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-primary-600" />
              Informations Client
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{order.clientNom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de commande:</span>
                <span className="font-medium">{formatDateTime(order.createdAt)}</span>
              </div>
              {order.confirmedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de confirmation:</span>
                  <span className="font-medium">{formatDateTime(order.confirmedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              Produits Commandés
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.productNom}</div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div className="font-bold text-primary-600">
                    {formatCurrency(item.totalLine)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments */}
          {payments.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary-600" />
                Paiements
              </h2>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Paiement #{payment.numeroPaiement}</div>
                        <div className="text-sm text-gray-600">{payment.typePaiement}</div>
                      </div>
                      <div className="font-bold text-primary-600">
                        {formatCurrency(payment.montant)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(payment.datePaiement)} - {payment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif Financier</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Sous-total HT:</span>
                <span className="font-medium">{formatCurrency(order.sousTotal)}</span>
              </div>
              {order.remiseFidelite > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Remise fidélité:</span>
                  <span className="font-medium">-{formatCurrency(order.remiseFidelite)}</span>
                </div>
              )}
              {order.remisePromo > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Remise promo:</span>
                  <span className="font-medium">-{formatCurrency(order.remisePromo)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Montant HT:</span>
                <span className="font-medium">{formatCurrency(order.montantHT)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (20%):</span>
                <span className="font-medium">{formatCurrency(order.tva)}</span>
              </div>
              <div className="border-t border-primary-200 pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold text-primary-900">
                  <span>Total TTC:</span>
                  <span>{formatCurrency(order.totalTTC)}</span>
                </div>
              </div>
              <div className="border-t border-primary-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span>Montant payé:</span>
                  <span className={`font-bold ${isFullyPaid ? 'text-green-600' : 'text-gray-900'}`}>
                    {formatCurrency(order.montantPaye)}
                  </span>
                </div>
                {!isFullyPaid && (
                  <div className="flex justify-between mt-2">
                    <span>Montant restant:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(order.montantRestant)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className={`card p-4 ${isFullyPaid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              {isFullyPaid ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Commande totalement payée</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Paiement partiel</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <PaymentDialog
          orderId={order.id}
          montantRestant={order.montantRestant}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={() => {
            setShowPaymentDialog(false)
            dispatch(fetchOrderById(id))
            dispatch(fetchPaymentsByOrder(id))
          }}
        />
      )}
    </div>
  )
}

export default OrderDetailPage