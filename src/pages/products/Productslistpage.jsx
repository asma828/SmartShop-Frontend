import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllProducts,
  selectFilteredProducts,
  selectProductsLoading,
  selectFilters,
  setFilters,
  resetFilters,
  deleteProduct,
} from '@store/slices/productSlice'
import { selectIsAdmin } from '@store/slices/authSlice'
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '@utils/formatUtils'

function ProductsListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const products = useSelector(selectFilteredProducts)
  const isLoading = useSelector(selectProductsLoading)
  const filters = useSelector(selectFilters)
  const isAdmin = useSelector(selectIsAdmin)

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${nom}" ?`)) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
        toast.success('Produit supprimé avec succès')
      } catch (error) {
        toast.error(error || 'Erreur lors de la suppression')
      }
    }
  }

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="badge badge-danger">Rupture</span>
    } else if (stock <= 10) {
      return <span className="badge badge-warning">Stock faible</span>
    } else {
      return <span className="badge badge-success">En stock</span>
    }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600'
    if (stock <= 10) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (isLoading && products.length === 0) {
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
            Gestion des Produits
          </h1>
          <p className="text-gray-600 mt-1">
            {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate('/products/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter className="w-5 h-5" />
          <span>Filtres et Recherche</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="input-field pl-10"
            />
          </div>

          {/* Stock Status Filter */}
          <select
            value={filters.stockStatus}
            onChange={(e) => dispatch(setFilters({ stockStatus: e.target.value }))}
            className="input-field"
          >
            <option value="all">Tous les stocks</option>
            <option value="in-stock">En stock (> 10)</option>
            <option value="low-stock">Stock faible (1-10)</option>
            <option value="out-of-stock">Rupture (0)</option>
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
              className="input-field flex-1"
            >
              <option value="nom">Trier par Nom</option>
              <option value="prix">Trier par Prix</option>
              <option value="stock">Trier par Stock</option>
            </select>
            <button
              onClick={() =>
                dispatch(setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' }))
              }
              className="btn-secondary px-4"
              title={filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Reset Filters */}
        {(filters.search || filters.stockStatus !== 'all' || filters.sortBy !== 'nom') && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.stockStatus !== 'all'
              ? 'Aucun produit ne correspond à vos critères de recherche'
              : 'Commencez par créer votre premier produit'}
          </p>
          {!filters.search && filters.stockStatus === 'all' && isAdmin && (
            <button
              onClick={() => navigate('/products/new')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un produit
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
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="font-medium text-gray-900">
                          {product.nom}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(product.prix)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                          {product.stock} unités
                        </span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.stock)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir le produit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => navigate(`/products/${product.id}/edit`)}
                            className="inline-flex items-center p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.nom)}
                            className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
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

export default ProductsListPage