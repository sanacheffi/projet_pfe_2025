import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Async thunk to submit contact form (Client side)
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (formData) => {
      const response = await axios.post(`${API_URL}/api/contacts`, formData);
      return response.data;
  }
);

// Async thunk to fetch all contact messages (Admin only)
export const fetchContactMessages = createAsyncThunk(
  "contact/fetchContactMessages",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Async thunk to toggle treated status
export const toggleTreated = createAsyncThunk(
  "contact/toggleTreated",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.patch(
        `${API_URL}/api/contacts/${id}/treated`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    error: null,
    contactMessages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit Contact
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.contactMessages = action.payload;
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleTreated.fulfilled, (state, action) => {
      // on remplace la réclamation mise à jour dans le tableau
      state.contactMessages = state.contactMessages.map((msg) =>
        msg._id === action.payload._id ? action.payload : msg
      );
    })
    .addCase(toggleTreated.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default contactSlice.reducer;
