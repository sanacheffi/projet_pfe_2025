import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

/** 
 * Client: submit a new customization request 
 * POST /api/customization
 */
export const createCustomization = createAsyncThunk(
  "customization/create",
  async (customizationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/customization`,
        customizationData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** 
 * Admin: fetch all customization requests 
 * GET /api/customization
 */
export const fetchAllCustomizations = createAsyncThunk(
  "customization/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(`${API_URL}/api/customization`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** 
 * Admin: fetch one customization by ID 
 * GET /api/customization/:id
 */
export const fetchCustomizationById = createAsyncThunk(
  "customization/fetchById",
  async (customizationId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(
        `${API_URL}/api/customization/${customizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** 
 * Admin: update the status of a customization request 
 * PUT /api/customization/:id/status
 */
export const updateCustomizationStatus = createAsyncThunk(
  "customization/updateStatus",
  async ({ customizationId, status }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const { data } = await axios.put(
        `${API_URL}/api/customization/${customizationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.customization;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/** 
 * Optional: convert customization into an order 
 * POST /api/customization/:id/convert
 */
export const convertCustomizationToOrder = createAsyncThunk(
  "customization/convertToOrder",
  async ({ customizationId, orderData }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.post(
        `${API_URL}/api/customization/${customizationId}/convert`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const customizationSlice = createSlice({
  name: "customization",
  initialState: {
    customizationList: [],
    selectedCustomization: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createCustomization
      .addCase(createCustomization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomization.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCustomization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchAllCustomizations
      .addCase(fetchAllCustomizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomizations.fulfilled, (state, action) => {
        state.loading = false;
        state.customizationList = action.payload;
      })
      .addCase(fetchAllCustomizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchCustomizationById
      .addCase(fetchCustomizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomization = action.payload;
      })
      .addCase(fetchCustomizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // updateCustomizationStatus
      .addCase(updateCustomizationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomizationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // update selectedCustomization if matches
        if (
          state.selectedCustomization &&
          state.selectedCustomization._id === updated._id
        ) {
          state.selectedCustomization = updated;
        }
        // update list
        const idx = state.customizationList.findIndex(
          (c) => c._id === updated._id
        );
        if (idx !== -1) state.customizationList[idx] = updated;
      })
      .addCase(updateCustomizationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // convertCustomizationToOrder
      .addCase(convertCustomizationToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertCustomizationToOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(convertCustomizationToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default customizationSlice.reducer;
