import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  createProduct,
  updateProduct,
  fetchProductById,
  selectCurrentProduct,
  selectProductsLoading,
  clearCurrentProduct,
} from '@store/slices/productSlice'
import { ArrowLeft, Save, Package } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentProduct = useSelector(selectCurrentProduct)
  const isLoading = useSelector(selectProductsLoading)
  const isEditMode = Boolean(id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nom: '',
      prix: '',
      stock: '',
    },
  })

  const stock = watch('stock')

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchProductById(id))
    }

    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id, isEditMode])

  useEffect(() => {
    if (isEditMode && currentProduct) {
      reset({
        nom: currentProduct.nom,
        prix: currentProduct.prix,
        stock: currentProduct.stock,
      })
    }
  }, [currentProduct, isEditMode, reset])

  const onSubmit = async (data) => {
    // Convert string to numbers
    const productData = {
      nom: data.nom,
      prix: parseFloat(data.prix),
      stock: parseInt(data.stock, 10),
    }

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData })).unwrap()
        toast.success('Produit mis à jour avec succès')
      } else {
        await dispatch(createProduct(productData)).unwrap()
        toast.success('Produit créé avec succès')
      }
      navigate('/products')
    } catch (error) {
      toast.error(error || 'Une erreur est survenue')
    }
  }

  const getStockStatus = (stockValue) => {
    const qty = parseInt(stockValue, 10)
    if (isNaN(qty)) return null

    if (qty === 0) {
      return { text: 'Rupture de stock', color: 'text-red-600 bg-red-50' }
    } else if (qty <= 10) {
      return { text: 'Stock faible - Réapprovisionnement recommandé', color: 'text-yellow-600 bg-yellow-50' }
    } else {
      return { text: 'Stock suffisant', color: 'text-green-600 bg-green-50' }
    }
  }

  const stockStatus = getStockStatus(stock)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            {isEditMode ? 'Modifier le Produit' : 'Nouveau Produit'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Modifiez les informations du produit'
              : 'Remplissez le formulaire pour créer un nouveau produit'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom */}
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              type="text"
              {...register('nom', {
                required: 'Le nom du produit est requis',
                minLength: {
                  value: 3,
                  message: 'Le nom doit contenir au moins 3 caractères',
                },
              })}
              className="input-field"
              placeholder="Ex: Ordinateur portable Dell XPS 15"
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
            )}
          </div>

          {/* Prix */}
          <div>
            <label
              htmlFor="prix"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prix (DH) <span className="text-red-500">*</span>
            </label>
            <input
              id="prix"
              type="number"
              step="0.01"
              min="0"
              {...register('prix', {
                required: 'Le prix est requis',
                min: {
                  value: 0.01,
                  message: 'Le prix doit être supérieur à 0',
                },
              })}
              className="input-field"
              placeholder="0.00"
            />
            {errors.prix && (
              <p className="mt-1 text-sm text-red-600">{errors.prix.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Saisir le prix TTC en dirhams marocains
            </p>
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantité en stock <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              {...register('stock', {
                required: 'La quantité en stock est requise',
                min: {
                  value: 0,
                  message: 'Le stock ne peut pas être négatif',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Le stock doit être un nombre entier',
                },
              })}
              className="input-field"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}

            {/* Stock Status Indicator */}
            {stockStatus && (
              <div className={`mt-2 p-3 rounded-lg ${stockStatus.color} flex items-center gap-2`}>
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">{stockStatus.text}</span>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Conseils de gestion du stock
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Stock &gt; 10 : Stock suffisant</li>
              <li>• Stock entre 1-10 : Stock faible, réapprovisionnement recommandé</li>
              <li>• Stock = 0 : Rupture de stock, réapprovisionnement urgent</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Save className="w-5 h-5" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                  <span>{isEditMode ? 'Mettre à jour' : 'Créer le produit'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn-secondary px-6"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormPage