import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import clientService from '@services/clientService'

// Initial state
const initialState = {
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  totalClients: 0,
}

// Async thunks
export const fetchAllClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await clientService.getAllClients()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des clients')
    }
  }
)

export const fetchClientById = createAsyncThunk(
  'clients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await clientService.getClientById(id)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Client introuvable')
    }
  }
)

export const createClient = createAsyncThunk(
  'clients/create',
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await clientService.createClient(clientData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du client')
    }
  }
)

export const updateClient = createAsyncThunk(
  'clients/update',
  async ({ id, clientData }, { rejectWithValue }) => {
    try {
      const data = await clientService.updateClient(id, clientData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du client')
    }
  }
)

export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du client')
    }
  }
)

export const fetchMyProfile = createAsyncThunk(
  'clients/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await clientService.getMyProfile()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du profil')
    }
  }
)

// Slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentClient: (state) => {
      state.currentClient = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchAllClients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.isLoading = false
        state.clients = action.payload
        state.totalClients = action.payload.length
        state.error = null
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentClient = action.payload
        state.error = null
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.clients.push(action.payload)
        state.totalClients += 1
        state.error = null
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.clients.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.clients[index] = action.payload
        }
        state.currentClient = action.payload
        state.error = null
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.clients = state.clients.filter(c => c.id !== action.payload)
        state.totalClients -= 1
        state.error = null
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch my profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentClient = action.payload
        state.error = null
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentClient } = clientSlice.actions
export default clientSlice.reducer

// Selectors
export const selectClients = (state) => state.clients.clients
export const selectCurrentClient = (state) => state.clients.currentClient
export const selectClientsLoading = (state) => state.clients.isLoading
export const selectClientsError = (state) => state.clients.error
export const selectTotalClients = (state) => state.clients.totalClients