import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductsLoading,
  clearCurrentProduct,
} from '@store/slices/productSlice'
import { selectIsAdmin } from '@store/slices/authSlice'
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  Archive,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@utils/formatUtils'

function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const product = useSelector(selectCurrentProduct)
  const isLoading = useSelector(selectProductsLoading)
  const isAdmin = useSelector(selectIsAdmin)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }

    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id])

  const getStockStatus = () => {
    if (!product) return null

    if (product.stock === 0) {
      return {
        icon: AlertTriangle,
        text: 'Rupture de stock',
        color: 'text-red-600 bg-red-50 border-red-200',
        badge: 'badge-danger',
      }
    } else if (product.stock <= 10) {
      return {
        icon: AlertTriangle,
        text: 'Stock faible',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        badge: 'badge-warning',
      }
    } else {
      return {
        icon: CheckCircle,
        text: 'En stock',
        color: 'text-green-600 bg-green-50 border-green-200',
        badge: 'badge-success',
      }
    }
  }

  if (isLoading && !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Produit introuvable</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary mt-4"
        >
          Retour à la liste
        </button>
      </div>
    )
  }

  const stockStatus = getStockStatus()
  const StockIcon = stockStatus?.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Détails du Produit
            </h1>
            <p className="text-gray-600 mt-1">
              Informations complètes et gestion du stock
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Modifier
          </button>
        )}
      </div>

      {/* Product Info Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-primary-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.nom}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: #{product.id}</p>
            </div>
          </div>
          {stockStatus && (
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${stockStatus.color} border`}>
              <StockIcon className="w-5 h-5" />
              <span className="font-semibold">{stockStatus.text}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Card */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Prix Unitaire</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {formatCurrency(product.prix)}
            </p>
          </div>

          {/* Stock Card */}
          <div className={`p-4 rounded-lg border ${stockStatus?.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <Archive className="w-5 h-5" />
              <span className="text-sm font-medium">Quantité en Stock</span>
            </div>
            <p className="text-3xl font-bold">
              {product.stock}
              <span className="text-lg font-normal ml-2">unités</span>
            </p>
          </div>

          {/* Total Value Card */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Valeur Totale</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {formatCurrency(product.prix * product.stock)}
            </p>
            <p className="text-xs text-purple-700 mt-1">
              Prix × Quantité
            </p>
          </div>
        </div>
      </div>

      {/* Stock Status Details */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Archive className="w-6 h-6 text-primary-600" />
          État du Stock
        </h3>

        {product.stock === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">
                  ⚠️ Rupture de stock
                </h4>
                <p className="text-red-800 mb-3">
                  Ce produit n'est plus disponible en stock. Un réapprovisionnement urgent est nécessaire.
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Aucune commande ne pourra être effectuée pour ce produit</li>
                  <li>• Contactez vos fournisseurs pour réapprovisionner</li>
                  <li>• Informez vos clients de la rupture temporaire</li>
                </ul>
              </div>
            </div>
          </div>
        ) : product.stock <= 10 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">
                  ⚠️ Stock faible - Action requise
                </h4>
                <p className="text-yellow-800 mb-3">
                  Il ne reste que {product.stock} unité{product.stock > 1 ? 's' : ''} en stock.
                  Un réapprovisionnement est recommandé pour éviter toute rupture.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Planifiez une commande de réapprovisionnement</li>
                  <li>• Vérifiez les délais de livraison avec vos fournisseurs</li>
                  <li>• Surveillez les ventes pour anticiper les ruptures</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">
                  ✓ Stock suffisant
                </h4>
                <p className="text-green-800 mb-3">
                  Le stock actuel de {product.stock} unités est suffisant pour les commandes en cours.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Le produit est disponible pour les nouvelles commandes</li>
                  <li>• Continuez à surveiller les niveaux de stock</li>
                  <li>• Anticipez les périodes de forte demande</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-600" />
          Informations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Date de création</span>
            <p className="font-medium text-gray-900 mt-1">
              {formatDate(product.createdAt)}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Dernière modification</span>
            <p className="font-medium text-gray-900 mt-1">
              {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage