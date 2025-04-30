import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
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


// async function to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
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


// async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productData,
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
  

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;

    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
      products: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAdminProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // Create Product
        .addCase(createProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
        })
        // Update Product
        .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex(
                (product) => product._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        })
        // Delete Product
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter(
                (product) => product._id !== action.payload
            );
        });
    },
});  

export default adminProductSlice.reducer;