import apiClient from './api'

const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} User data
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Déconnexion utilisateur
   * @returns {Promise<void>}
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  /**
   * Récupérer l'utilisateur actuellement connecté
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}

export default authService