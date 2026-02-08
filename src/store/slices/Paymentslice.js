import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentService from '@services/paymentService'

// Initial state
const initialState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const addPayment = createAsyncThunk(
  'payments/add',
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await paymentService.addPayment(paymentData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'ajout du paiement')
    }
  }
)

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentById(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Paiement introuvable')
    }
  }
)

export const fetchPaymentsByOrder = createAsyncThunk(
  'payments/fetchByOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentsByOrder(orderId)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des paiements')
    }
  }
)

export const encashPayment = createAsyncThunk(
  'payments/encash',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.encashPayment(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'encaissement')
    }
  }
)

export const rejectPayment = createAsyncThunk(
  'payments/reject',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.rejectPayment(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du rejet')
    }
  }
)

// Slice
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null
    },
    clearPayments: (state) => {
      state.payments = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments.push(action.payload)
        state.currentPayment = action.payload
        state.error = null
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPayment = action.payload
        state.error = null
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch payments by order
      .addCase(fetchPaymentsByOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentsByOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = action.payload
        state.error = null
      })
      .addCase(fetchPaymentsByOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Encash payment
      .addCase(encashPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(encashPayment.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.payments.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
        if (state.currentPayment?.id === action.payload.id) {
          state.currentPayment = action.payload
        }
        state.error = null
      })
      .addCase(encashPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Reject payment
      .addCase(rejectPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(rejectPayment.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.payments.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
        if (state.currentPayment?.id === action.payload.id) {
          state.currentPayment = action.payload
        }
        state.error = null
      })
      .addCase(rejectPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentPayment, clearPayments } = paymentSlice.actions
export default paymentSlice.reducer

// Selectors
export const selectPayments = (state) => state.payments.payments
export const selectCurrentPayment = (state) => state.payments.currentPayment
export const selectPaymentsLoading = (state) => state.payments.isLoading
export const selectPaymentsError = (state) => state.payments.error