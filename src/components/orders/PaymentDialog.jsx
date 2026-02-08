import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addPayment } from '@store/slices/paymentSlice'
import { X, CreditCard } from 'lucide-react'
import { formatCurrency } from '@utils/formatUtils'
import toast from 'react-hot-toast'

function PaymentDialog({ orderId, montantRestant, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    montant: montantRestant,
    typePaiement: 'ESPECES',
    datePaiement: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    reference: '',
    banque: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const paymentData = {
        orderId: parseInt(orderId),
        montant: parseFloat(formData.montant),
        typePaiement: formData.typePaiement,
        datePaiement: formData.datePaiement,
        dateEcheance: formData.dateEcheance || null,
        reference: formData.reference || null,
        banque: formData.banque || null,
      }

      await dispatch(addPayment(paymentData)).unwrap()
      toast.success('Paiement ajouté avec succès')
      onSuccess()
    } catch (error) {
      toast.error(error || 'Erreur lors de l\'ajout du paiement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary-600" />
              Ajouter un Paiement
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <div className="text-sm text-gray-600">Montant restant à payer</div>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(montantRestant)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant du paiement <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={montantRestant}
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de paiement <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.typePaiement}
                onChange={(e) => setFormData({ ...formData, typePaiement: e.target.value })}
                className="input-field"
                required
              >
                <option value="ESPECES">Espèces</option>
                <option value="CHEQUE">Chèque</option>
                <option value="VIREMENT">Virement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de paiement <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.datePaiement}
                onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                className="input-field"
                required
              />
            </div>

            {formData.typePaiement === 'CHEQUE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateEcheance}
                    onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de chèque
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="input-field"
                    placeholder="CHQ123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banque
                  </label>
                  <input
                    type="text"
                    value={formData.banque}
                    onChange={(e) => setFormData({ ...formData, banque: e.target.value })}
                    className="input-field"
                    placeholder="Attijariwafa Bank"
                  />
                </div>
              </>
            )}

            {formData.typePaiement === 'VIREMENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Référence
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="input-field"
                  placeholder="VIR123456"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le paiement'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentDialog