import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// 👉 Async thunk to submit contact form (Client side)
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/contacts`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Erreur d'envoi");
    }
  }
);

// 👉 Async thunk to fetch all contact messages (Admin only)
export const fetchContactMessages = createAsyncThunk(
  "contact/fetchContactMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/contacts`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Erreur de récupération");
    }
  }
);

// 🔧 Slice
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    error: null,
    success: false,
    contactMessages: [],
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Contact
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
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
      });
  },
});

export const { resetContactState } = contactSlice.actions;

export default contactSlice.reducer;
