import apiClient from './api'

const productService = {
  /**
   * Récupérer tous les produits
   * @returns {Promise<Array>} Liste des produits
   */
  getAllProducts: async () => {
    const response = await apiClient.get('/products')
    return response.data
  },

  /**
   * Récupérer un produit par ID
   * @param {number} id - ID du produit
   * @returns {Promise<Object>} Données du produit
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },

  /**
   * Créer un nouveau produit
   * @param {Object} productData - { nom, prix, stock }
   * @returns {Promise<Object>} Produit créé
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/products', productData)
    return response.data
  },

  /**
   * Mettre à jour un produit
   * @param {number} id - ID du produit
   * @param {Object} productData - Données à mettre à jour
   * @returns {Promise<Object>} Produit mis à jour
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  },

  /**
   * Supprimer un produit (soft delete)
   * @param {number} id - ID du produit
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    await apiClient.delete(`/products/${id}`)
  },
}

export default productService