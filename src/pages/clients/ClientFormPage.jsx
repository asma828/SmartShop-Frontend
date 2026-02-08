import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  createClient,
  updateClient,
  fetchClientById,
  selectCurrentClient,
  selectClientsLoading,
  clearCurrentClient,
} from '@store/slices/clientSlice'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

function ClientFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentClient = useSelector(selectCurrentClient)
  const isLoading = useSelector(selectClientsLoading)
  const isEditMode = Boolean(id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchClientById(id))
    }

    return () => {
      dispatch(clearCurrentClient())
    }
  }, [dispatch, id, isEditMode])

  useEffect(() => {
    if (isEditMode && currentClient) {
      reset({
        nom: currentClient.nom,
        email: currentClient.email,
        username: currentClient.username || '',
      })
    }
  }, [currentClient, isEditMode, reset])

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(updateClient({ id, clientData: data })).unwrap()
        toast.success('Client mis à jour avec succès')
      } else {
        await dispatch(createClient(data)).unwrap()
        toast.success('Client créé avec succès')
      }
      navigate('/clients')
    } catch (error) {
      toast.error(error || 'Une erreur est survenue')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/clients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            {isEditMode ? 'Modifier le Client' : 'Nouveau Client'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Modifiez les informations du client'
              : 'Remplissez le formulaire pour créer un nouveau client'}
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
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              type="text"
              {...register('nom', {
                required: 'Le nom est requis',
                minLength: {
                  value: 3,
                  message: 'Le nom doit contenir au moins 3 caractères',
                },
              })}
              className="input-field"
              placeholder="Ex: Mohamed Alami"
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format d\'email invalide',
                },
              })}
              className="input-field"
              placeholder="exemple@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom d'utilisateur <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              {...register('username', {
                required: 'Le nom d\'utilisateur est requis',
                minLength: {
                  value: 3,
                  message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
                },
              })}
              className="input-field"
              placeholder="username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mot de passe {isEditMode && '(laisser vide pour ne pas modifier)'}
              {!isEditMode && <span className="text-red-500"> *</span>}
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: isEditMode ? false : 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
            {!isEditMode && (
              <p className="mt-1 text-xs text-gray-500">
                Minimum 6 caractères
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Un compte utilisateur avec le rôle CLIENT
              sera automatiquement créé pour ce client.
            </p>
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
                    <UserPlus className="w-5 h-5" />
                  )}
                  <span>{isEditMode ? 'Mettre à jour' : 'Créer le client'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/clients')}
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

export default ClientFormPage