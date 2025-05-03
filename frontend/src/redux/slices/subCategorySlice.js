import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Fetch all subcategories
export const fetchSubCategories = createAsyncThunk(
  'subcategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch subcategory by ID
export const fetchSubCategoryById = createAsyncThunk(
    'subcategories/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/api/subcategories/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

// Create a subcategory
export const createSubCategory = createAsyncThunk(
  'subcategories/create',
  async (data, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.post(`${API_URL}/api/subcategories`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a subcategory
export const updateSubCategory = createAsyncThunk(
    'subcategories/update',
    async ({ id, data }, { getState, rejectWithValue }) => {
      const { token } = getState().auth;
      try {
        const response = await axios.put(`${API_URL}/api/subcategories/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

// Delete a subcategory
export const deleteSubCategory = createAsyncThunk(
  'subcategories/delete',
  async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      await axios.delete(`${API_URL}/api/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const subCategorySlice = createSlice({
  name: 'subcategories',
  initialState: {
    subCategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.selectedSubCategory = action.payload;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.subCategories.push(action.payload);
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const index = state.subCategories.findIndex(sub => sub._id === action.payload._id);
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.subCategories = state.subCategories.filter(sub => sub._id !== action.payload);
      });
  },
});

export default subCategorySlice.reducer;
