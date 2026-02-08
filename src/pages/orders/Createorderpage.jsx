import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllClients, selectClients } from '@store/slices/clientSlice'
import { fetchAllProducts, selectProducts } from '@store/slices/productSlice'
import { createOrder } from '@store/slices/orderSlice'
import { ArrowLeft, Plus, Trash2, ShoppingCart, User, Package, Tag, Calculator } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '@utils/formatUtils'

function CreateOrderPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const clients = useSelector(selectClients)
  const products = useSelector(selectProducts)

  const [selectedClient, setSelectedClient] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [codePromo, setCodePromo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchAllClients())
    dispatch(fetchAllProducts())
  }, [dispatch])

  // Add product to order
  const addItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }])
  }

  // Remove item
  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...orderItems]
    newItems[index][field] = value
    setOrderItems(newItems)
  }

  // Calculate totals
  const calculateTotals = () => {
    let sousTotal = 0

    orderItems.forEach(item => {
      const product = products.find(p => p.id === parseInt(item.productId))
      if (product) {
        sousTotal += product.prix * item.quantity
      }
    })

    return { sousTotal }
  }

  const { sousTotal } = calculateTotals()

  // Get client loyalty tier
  const getClientTier = () => {
    if (!selectedClient) return null
    const client = clients.find(c => c.id === parseInt(selectedClient))
    return client?.niveauFidelite
  }

  // Get loyalty discount info
  const getLoyaltyInfo = () => {
    const tier = getClientTier()
    if (!tier) return null

    const discounts = {
      BASIC: { rate: 0, minAmount: 0 },
      SILVER: { rate: 5, minAmount: 500 },
      GOLD: { rate: 10, minAmount: 800 },
      PLATINUM: { rate: 15, minAmount: 1200 },
    }

    const info = discounts[tier]
    const eligible = sousTotal >= info.minAmount

    return {
      tier,
      rate: info.rate,
      minAmount: info.minAmount,
      eligible,
      amount: eligible ? (sousTotal * info.rate) / 100 : 0,
    }
  }

  const loyaltyInfo = getLoyaltyInfo()

  // Validate form
  const validateForm = () => {
    if (!selectedClient) {
      toast.error('Veuillez sélectionner un client')
      return false
    }

    if (orderItems.length === 0) {
      toast.error('Veuillez ajouter au moins un produit')
      return false
    }

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i]
      if (!item.productId) {
        toast.error(`Veuillez sélectionner un produit pour la ligne ${i + 1}`)
        return false
      }
      if (!item.quantity || item.quantity <= 0) {
        toast.error(`Veuillez saisir une quantité valide pour la ligne ${i + 1}`)
        return false
      }

      // Check stock
      const product = products.find(p => p.id === parseInt(item.productId))
      if (product && product.stock < item.quantity) {
        toast.error(`Stock insuffisant pour ${product.nom} (Disponible: ${product.stock})`)
        return false
      }
    }

    // Validate promo code format if provided
    if (codePromo && !/^PROMO-[A-Z0-9]{4}$/.test(codePromo)) {
      toast.error('Format de code promo invalide (ex: PROMO-ABCD)')
      return false
    }

    return true
  }

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const orderData = {
        clientId: parseInt(selectedClient),
        items: orderItems.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
        codePromo: codePromo || null,
      }

      const result = await dispatch(createOrder(orderData)).unwrap()
      toast.success('Commande créée avec succès')
      navigate(`/orders/${result.id}`)
    } catch (error) {
      toast.error(error || 'Erreur lors de la création de la commande')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Nouvelle Commande
          </h1>
          <p className="text-gray-600 mt-1">
            Créez une nouvelle commande multi-produits
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-primary-600" />
            1. Sélectionner le Client
          </h2>
          <select
            value={selectedClient || ''}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input-field"
            required
          >
            <option value="">-- Choisir un client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.nom} ({client.email}) - {client.niveauFidelite}
              </option>
            ))}
          </select>

          {/* Loyalty Info */}
          {loyaltyInfo && (
            <div className={`mt-4 p-4 rounded-lg ${
              loyaltyInfo.eligible ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-gray-900">
                  Niveau de fidélité: {loyaltyInfo.tier}
                </span>
              </div>
              {loyaltyInfo.eligible ? (
                <p className="text-green-700 text-sm">
                  ✅ Remise de {loyaltyInfo.rate}% applicable ({formatCurrency(loyaltyInfo.amount)})
                </p>
              ) : (
                <p className="text-gray-600 text-sm">
                  Remise de {loyaltyInfo.rate}% applicable si montant ≥ {formatCurrency(loyaltyInfo.minAmount)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products Selection */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              2. Ajouter des Produits
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item, index) => {
                const selectedProduct = products.find(p => p.id === parseInt(item.productId))
                const lineTotal = selectedProduct ? selectedProduct.prix * item.quantity : 0

                return (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Product Select */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Produit
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          className="input-field"
                          required
                        >
                          <option value="">-- Sélectionner --</option>
                          {products.filter(p => p.stock > 0).map(product => (
                            <option key={product.id} value={product.id}>
                              {product.nom} - {formatCurrency(product.prix)} (Stock: {product.stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedProduct?.stock || 999}
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    {/* Line Total & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Total ligne</div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(lineTotal)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary-600" />
            3. Code Promo (Optionnel)
          </h2>
          <input
            type="text"
            value={codePromo}
            onChange={(e) => setCodePromo(e.target.value.toUpperCase())}
            placeholder="PROMO-XXXX"
            className="input-field"
            pattern="PROMO-[A-Z0-9]{4}"
          />
          <p className="mt-2 text-sm text-gray-500">
            Format: PROMO-XXXX (ex: PROMO-2024)
          </p>
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary-600" />
              Récapitulatif
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Sous-total HT:</span>
                <span className="font-semibold">{formatCurrency(sousTotal)}</span>
              </div>
              {loyaltyInfo?.eligible && (
                <div className="flex justify-between text-green-700">
                  <span>Remise fidélité ({loyaltyInfo.rate}%):</span>
                  <span className="font-semibold">-{formatCurrency(loyaltyInfo.amount)}</span>
                </div>
              )}
              <div className="border-t border-primary-200 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-primary-900">
                  <span>Total estimé:</span>
                  <span>{formatCurrency(sousTotal)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  * Les montants finaux (TVA, remises) seront calculés par le système
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || orderItems.length === 0}
            className="btn-primary flex items-center gap-2 flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Créer la commande</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="btn-secondary px-6"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateOrderPage