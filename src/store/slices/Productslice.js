import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '@services/productService'

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalProducts: 0,
  filters: {
    search: '',
    stockStatus: 'all', // all, in-stock, low-stock, out-of-stock
    sortBy: 'nom', // nom, prix, stock
    sortOrder: 'asc', // asc, desc
  },
}

// Async thunks
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getAllProducts()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des produits')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProductById(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Produit introuvable')
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const data = await productService.createProduct(productData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du produit')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const data = await productService.updateProduct(id, productData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du produit')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du produit')
    }
  }
)

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
        state.totalProducts = action.payload.length
        state.error = null
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
        state.error = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products.push(action.payload)
        state.totalProducts += 1
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.currentProduct = action.payload
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.filter(p => p.id !== action.payload)
        state.totalProducts -= 1
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentProduct, setFilters, resetFilters } = productSlice.actions
export default productSlice.reducer

// Selectors
export const selectProducts = (state) => state.products.products
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectProductsLoading = (state) => state.products.isLoading
export const selectProductsError = (state) => state.products.error
export const selectTotalProducts = (state) => state.products.totalProducts
export const selectFilters = (state) => state.products.filters

// Filtered products selector
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.products
  const { search, stockStatus, sortBy, sortOrder } = filters

  let filtered = [...products]

  // Filter by search
  if (search) {
    filtered = filtered.filter(p =>
      p.nom.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Filter by stock status
  if (stockStatus !== 'all') {
    filtered = filtered.filter(p => {
      if (stockStatus === 'in-stock') return p.stock > 10
      if (stockStatus === 'low-stock') return p.stock > 0 && p.stock <= 10
      if (stockStatus === 'out-of-stock') return p.stock === 0
      return true
    })
  }

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'nom') {
      comparison = a.nom.localeCompare(b.nom)
    } else if (sortBy === 'prix') {
      comparison = a.prix - b.prix
    } else if (sortBy === 'stock') {
      comparison = a.stock - b.stock
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return filtered
}