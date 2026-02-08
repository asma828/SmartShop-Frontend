import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllClients,
  selectClients,
  selectClientsLoading,
  deleteClient,
} from '@store/slices/clientSlice'
import { Plus, Search, Eye, Edit, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@utils/dateUtils'

function ClientsListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const clients = useSelector(selectClients)
  const isLoading = useSelector(selectClientsLoading)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchAllClients())
  }, [dispatch])

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${nom}" ?`)) {
      try {
        await dispatch(deleteClient(id)).unwrap()
        toast.success('Client supprimé avec succès')
      } catch (error) {
        toast.error(error || 'Erreur lors de la suppression')
      }
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLoyaltyBadgeColor = (tier) => {
    const colors = {
      BASIC: 'badge badge-info',
      SILVER: 'badge bg-gray-400 text-white',
      GOLD: 'badge bg-yellow-500 text-white',
      PLATINUM: 'badge bg-purple-600 text-white',
    }
    return colors[tier] || 'badge'
  }

  if (isLoading && clients.length === 0) {
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
            Gestion des Clients
          </h1>
          <p className="text-gray-600 mt-1">
            {clients.length} client{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/clients/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun client trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Aucun client ne correspond à votre recherche'
              : 'Commencez par créer votre premier client'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/clients/new')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un client
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fidélité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Dépensé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getLoyaltyBadgeColor(client.niveauFidelite)}>
                        {client.niveauFidelite}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {client.totalOrders || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {client.totalSpent?.toFixed(2) || '0.00'} DH
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir le profil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                        className="inline-flex items-center p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.nom)}
                        className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsListPage