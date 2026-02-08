import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '@services/orderService'

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all', // all, PENDING, CONFIRMED, CANCELED, REJECTED
    clientId: null,
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 9, // 3x3 grid
    totalItems: 0,
    totalPages: 0,
  },
}

// Async thunks
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderService.getAllOrders()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des commandes')
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrderById(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Commande introuvable')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderService.createOrder(orderData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la commande')
    }
  }
)

export const fetchOrdersByClient = createAsyncThunk(
  'orders/fetchByClient',
  async (clientId, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrdersByClient(clientId)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des commandes')
    }
  }
)

export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrdersByStatus(status)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des commandes')
    }
  }
)

export const confirmOrder = createAsyncThunk(
  'orders/confirm',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.confirmOrder(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la confirmation de la commande')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.cancelOrder(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'annulation de la commande')
    }
  }
)

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      // Reset to page 1 when filters change
      state.pagination.currentPage = 1
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.currentPage = 1
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload
      state.pagination.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
        state.error = null
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload
        state.error = null
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders.push(action.payload)
        state.currentOrder = action.payload
        state.error = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch by client
      .addCase(fetchOrdersByClient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrdersByClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
        state.error = null
      })
      .addCase(fetchOrdersByClient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch by status
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
        state.error = null
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Confirm order
      .addCase(confirmOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
        state.error = null
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
        state.error = null
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentOrder, setFilters, resetFilters, setPage, setItemsPerPage } = orderSlice.actions
export default orderSlice.reducer

// Selectors
export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectOrdersLoading = (state) => state.orders.isLoading
export const selectOrdersError = (state) => state.orders.error
export const selectOrderFilters = (state) => state.orders.filters
export const selectPagination = (state) => state.orders.pagination

// Filtered orders selector
export const selectFilteredOrders = (state) => {
  const { orders, filters } = state.orders
  let filtered = [...orders]

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter(o => o.status === filters.status)
  }

  // Filter by client
  if (filters.clientId) {
    filtered = filtered.filter(o => o.clientId === filters.clientId)
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return filtered
}

// Paginated orders selector
export const selectPaginatedOrders = (state) => {
  const filtered = selectFilteredOrders(state)
  const { currentPage, itemsPerPage } = state.orders.pagination

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedOrders = filtered.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return {
    orders: paginatedOrders,
    totalItems: filtered.length,
    totalPages,
    currentPage,
    itemsPerPage,
  }
}