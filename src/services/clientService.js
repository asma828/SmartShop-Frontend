import apiClient from './api'

const clientService = {
  /**
   * Récupérer tous les clients
   * @returns {Promise<Array>} Liste des clients
   */
  getAllClients: async () => {
    const response = await apiClient.get('/clients')
    return response.data
  },

  /**
   * Récupérer un client par ID
   * @param {number} id - ID du client
   * @returns {Promise<Object>} Données du client
   */
  getClientById: async (id) => {
    const response = await apiClient.get(`/clients/${id}`)
    return response.data
  },

  /**
   * Créer un nouveau client
   * @param {Object} clientData - { nom, email, username, password }
   * @returns {Promise<Object>} Client créé
   */
  createClient: async (clientData) => {
    const response = await apiClient.post('/clients', clientData)
    return response.data
  },

  /**
   * Mettre à jour un client
   * @param {number} id - ID du client
   * @param {Object} clientData - Données à mettre à jour
   * @returns {Promise<Object>} Client mis à jour
   */
  updateClient: async (id, clientData) => {
    const response = await apiClient.put(`/clients/${id}`, clientData)
    return response.data
  },

  /**
   * Supprimer un client
   * @param {number} id - ID du client
   * @returns {Promise<void>}
   */
  deleteClient: async (id) => {
    await apiClient.delete(`/clients/${id}`)
  },

  /**
   * Récupérer le profil du client connecté
   * @returns {Promise<Object>} Profil complet du client avec statistiques
   */
  getMyProfile: async () => {
    const response = await apiClient.get('/clients/me/profile')
    return response.data
  },
}

export default clientService