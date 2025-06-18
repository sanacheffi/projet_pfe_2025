import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Async thunk to submit devis form (Client side)
export const createDevis = createAsyncThunk(
  "devis/create",
  async (devisData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/devis`, devisData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch all demande de devis (Admin only)
export const fetchAllDevis = createAsyncThunk(
  "devis/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(`${API_URL}/api/devis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDevisById = createAsyncThunk(
  "devis/fetchDevisById",
  async (devisId, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  try {
    const response = await axios.get(
      `${API_URL}/api/devis/${devisId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}
);

// Mise à jour du statut d’un devis (admin)
export const updateDevisStatus = createAsyncThunk(
  "devis/updateStatus",
  async ({ devisId, status }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const { data } = await axios.put(
        `${API_URL}/api/devis/${devisId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.devis;                 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Convert devis to order
export const convertDevisToOrder = createAsyncThunk(
  "devis/convertToOrder",
  async ({ devisId, orderData }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.post(
        `${API_URL}/api/devis/${devisId}/convert`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const devisSlice = createSlice({
  name: "devis",
  initialState: {
    devisList: [],
    selectedDevis: null, 
    loading: false,
    error: null,   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevis.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAllDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDevis.fulfilled, (state, action) => {
        state.loading = false;
        state.devisList = action.payload;
      })
      .addCase(fetchAllDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDevisById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevisById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDevis = action.payload;
      })
      .addCase(fetchDevisById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDevisStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevisStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;                     // devis complet

        // Met à jour selectedDevis
        if (state.selectedDevis && state.selectedDevis._id === updated._id) {
          state.selectedDevis = updated;
        }

        // Met à jour la liste
        const idx = state.devisList.findIndex((d) => d._id === updated._id);
        if (idx !== -1) state.devisList[idx] = updated;
      })
      .addCase(updateDevisStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(convertDevisToOrder.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(convertDevisToOrder.fulfilled, (state, action) => {
  state.loading = false;
  // Optionally handle response or reset selected devis
})
.addCase(convertDevisToOrder.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export default devisSlice.reducer;