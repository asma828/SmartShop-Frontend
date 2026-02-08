import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour les cookies de session
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log des requêtes en mode développement
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log des réponses en mode développement
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    // Log des erreurs
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.status, error.response?.data)
    }

    // Gestion des erreurs spécifiques
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Non authentifié - rediriger vers login si nécessaire
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          // Accès refusé
          console.error('Accès refusé')
          break
        case 404:
          console.error('Ressource non trouvée')
          break
        case 500:
          console.error('Erreur serveur')
          break
        default:
          console.error('Erreur API:', error.response.data?.message)
      }
    } else if (error.request) {
      console.error('Aucune réponse du serveur')
    } else {
      console.error('Erreur de configuration de la requête')
    }

    return Promise.reject(error)
  }
)

export default apiClient