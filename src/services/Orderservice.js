import apiClient from './api'

const orderService = {
  /**
   * Récupérer toutes les commandes
   * @returns {Promise<Array>} Liste des commandes
   */
  getAllOrders: async () => {
    const response = await apiClient.get('/Orders')
    return response.data
  },

  /**
   * Récupérer une commande par ID
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Données de la commande
   */
  getOrderById: async (id) => {
    const response = await apiClient.get(`/Orders/${id}`)
    return response.data
  },

  /**
   * Créer une nouvelle commande
   * @param {Object} orderData - { clientId, items: [{productId, quantity}], codePromo }
   * @returns {Promise<Object>} Commande créée
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/Orders', orderData)
    return response.data
  },

  /**
   * Récupérer les commandes d'un client
   * @param {number} clientId - ID du client
   * @returns {Promise<Array>} Liste des commandes
   */
  getOrdersByClient: async (clientId) => {
    const response = await apiClient.get(`/Orders/client/${clientId}`)
    return response.data
  },

  /**
   * Récupérer les commandes par statut
   * @param {string} status - PENDING, CONFIRMED, CANCELED, REJECTED
   * @returns {Promise<Array>} Liste des commandes
   */
  getOrdersByStatus: async (status) => {
    const response = await apiClient.get(`/Orders/status/${status}`)
    return response.data
  },

  /**
   * Confirmer une commande
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Commande confirmée
   */
  confirmOrder: async (id) => {
    const response = await apiClient.put(`/Orders/${id}/confirm`)
    return response.data
  },

  /**
   * Annuler une commande
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Commande annulée
   */
  cancelOrder: async (id) => {
    const response = await apiClient.put(`/Orders/${id}/cancl`)
    return response.data
  },
}

export default orderService