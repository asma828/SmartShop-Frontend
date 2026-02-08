/**
 * Formate une date ISO en format lisible français
 * @param {string} dateString - Date ISO string
 * @returns {string} Date formatée (ex: "15 janv. 2024")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

/**
 * Formate une date ISO en format date et heure
 * @param {string} dateString - Date ISO string
 * @returns {string} Date et heure formatée (ex: "15 janv. 2024 à 14:30")
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }

  const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(date)
  const formattedTime = new Intl.DateTimeFormat('fr-FR', timeOptions).format(date)

  return `${formattedDate} à ${formattedTime}`
}

/**
 * Formate un nombre en devise marocaine
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté (ex: "1 234,56 DH")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0,00 DH'

  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' DH'
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} number - Nombre à formater
 * @returns {string} Nombre formaté (ex: "1 234")
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0'

  return new Intl.NumberFormat('fr-FR').format(number)
}

/**
 * Calcule le nombre de jours entre deux dates
 * @param {string} date1 - Première date ISO
 * @param {string} date2 - Deuxième date ISO (optionnelle, défaut: aujourd'hui)
 * @returns {number} Nombre de jours
 */
export const daysBetween = (date1, date2 = new Date()) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Vérifie si une date est passée
 * @param {string} dateString - Date ISO string
 * @returns {boolean}
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

/**
 * Formate une date relative (ex: "il y a 2 jours")
 * @param {string} dateString - Date ISO string
 * @returns {string}
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  const now = new Date()
  const diffSeconds = Math.floor((now - date) / 1000)

  if (diffSeconds < 60) return 'À l\'instant'
  if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)} min`
  if (diffSeconds < 86400) return `Il y a ${Math.floor(diffSeconds / 3600)}h`
  if (diffSeconds < 604800) return `Il y a ${Math.floor(diffSeconds / 86400)} jour${Math.floor(diffSeconds / 86400) > 1 ? 's' : ''}`

  return formatDate(dateString)
}