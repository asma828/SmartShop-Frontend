import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchClientById,
  selectCurrentClient,
  selectClientsLoading,
  clearCurrentClient,
} from '@store/slices/clientSlice'
import {
  ArrowLeft,
  Edit,
  Mail,
  Calendar,
  Award,
  ShoppingBag,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@utils/formatUtils'

function ClientProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const client = useSelector(selectCurrentClient)
  const isLoading = useSelector(selectClientsLoading)

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id))
    }

    return () => {
      dispatch(clearCurrentClient())
    }
  }, [dispatch, id])

  const getLoyaltyColor = (tier) => {
    const colors = {
      BASIC: 'text-blue-600 bg-blue-50',
      SILVER: 'text-gray-600 bg-gray-100',
      GOLD: 'text-yellow-600 bg-yellow-50',
      PLATINUM: 'text-purple-600 bg-purple-50',
    }
    return colors[tier] || 'text-gray-600 bg-gray-100'
  }

  const getLoyaltyDescription = (tier) => {
    const descriptions = {
      BASIC: 'Aucune remise',
      SILVER: 'Remise de 5% sur commandes ≥ 500 DH',
      GOLD: 'Remise de 10% sur commandes ≥ 800 DH',
      PLATINUM: 'Remise de 15% sur commandes ≥ 1200 DH',
    }
    return descriptions[tier] || ''
  }

  if (isLoading && !client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client introuvable</p>
        <button
          onClick={() => navigate('/clients')}
          className="btn-primary mt-4"
        >
          Retour à la liste
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Profil Client
            </h1>
            <p className="text-gray-600 mt-1">
              Informations détaillées et statistiques
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/clients/${id}/edit`)}
          className="btn-primary flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Modifier
        </button>
      </div>

      {/* Client Info Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {client.nom.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{client.nom}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${getLoyaltyColor(client.niveauFidelite)}`}>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">{client.niveauFidelite}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Membre depuis</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(client.createdAt)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Nombre de commandes</p>
            <p className="text-lg font-semibold text-gray-900">
              {client.totalOrders || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total dépensé</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(client.totalSpent || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Loyalty Program Details */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-600" />
          Programme de Fidélité
        </h3>
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Niveau actuel</p>
              <p className="text-2xl font-bold text-primary-700">
                {client.niveauFidelite}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-lg ${getLoyaltyColor(client.niveauFidelite)} border-2 border-current`}>
              <Award className="w-8 h-8" />
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            {getLoyaltyDescription(client.niveauFidelite)}
          </p>

          {/* Progress to next level */}
          {client.niveauFidelite !== 'PLATINUM' && (
            <div className="mt-6 pt-6 border-t border-primary-200">
              <p className="text-sm text-gray-600 mb-2">Progression vers le niveau suivant</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Commandes: {client.totalOrders || 0}</span>
                  <span className="text-gray-500">
                    {client.niveauFidelite === 'BASIC' && '/ 3 pour SILVER'}
                    {client.niveauFidelite === 'SILVER' && '/ 10 pour GOLD'}
                    {client.niveauFidelite === 'GOLD' && '/ 20 pour PLATINUM'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dépenses: {formatCurrency(client.totalSpent || 0)}</span>
                  <span className="text-gray-500">
                    {client.niveauFidelite === 'BASIC' && '/ 1000 DH pour SILVER'}
                    {client.niveauFidelite === 'SILVER' && '/ 5000 DH pour GOLD'}
                    {client.niveauFidelite === 'GOLD' && '/ 15000 DH pour PLATINUM'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order History */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-600" />
          Historique des Commandes
        </h3>

        {client.firstOrderDate ? (
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Première commande</span>
              <span className="font-medium">{formatDate(client.firstOrderDate)}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Dernière commande</span>
              <span className="font-medium">{formatDate(client.lastOrderDate)}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            Aucune commande pour le moment
          </p>
        )}
      </div>
    </div>
  )
}

export default ClientProfilePage