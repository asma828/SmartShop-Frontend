import apiClient from './api'

const paymentService = {
  /**
   * Ajouter un paiement à une commande
   * @param {Object} paymentData - { orderId, montant, typePaiement, datePaiement, dateEcheance, reference, banque }
   * @returns {Promise<Object>} Paiement créé
   */
  addPayment: async (paymentData) => {
    const response = await apiClient.post('/payements', paymentData)
    return response.data
  },

  /**
   * Récupérer un paiement par ID
   * @param {number} id - ID du paiement
   * @returns {Promise<Object>} Données du paiement
   */
  getPaymentById: async (id) => {
    const response = await apiClient.get(`/payements/${id}`)
    return response.data
  },

  /**
   * Récupérer tous les paiements d'une commande
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Array>} Liste des paiements
   */
  getPaymentsByOrder: async (orderId) => {
    const response = await apiClient.get(`/payements/order/${orderId}`)
    return response.data
  },

  /**
   * Encaisser un paiement (chèque/virement)
   * @param {number} id - ID du paiement
   * @returns {Promise<Object>} Paiement encaissé
   */
  encashPayment: async (id) => {
    const response = await apiClient.put(`/payements/${id}/encaisser`)
    return response.data
  },

  /**
   * Rejeter un paiement
   * @param {number} id - ID du paiement
   * @returns {Promise<Object>} Paiement rejeté
   */
  rejectPayment: async (id) => {
    const response = await apiClient.put(`/payements/${id}/reject`)
    return response.data
  },
}

export default paymentService