// src/features/chatbot/chatbotSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to send a question to the backend chatbot
export const sendQuestion = createAsyncThunk(
  'chatbot/sendQuestion',
  async (question, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { question });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors de la communication avec le chatbot.'
      );
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    question: '',
    response: '',
    loading: false,
    error: null,
    debug: null,
    history: [] // [{ question, response, debug }]
  },
  reducers: {
    clearChat(state) {
      state.question = '';
      state.response = '';
      state.debug = null;
      state.error = null;
      state.history = [];
    }
  },
 extraReducers: (builder) => {
  builder
    .addCase(sendQuestion.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.response = '';
      state.question = action.meta.arg;

      // Immediately add user's question with empty response to history
      state.history.push({
        question: action.meta.arg,
        response: '',
        debug: null,
      });
    })
    .addCase(sendQuestion.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload.response;
      state.debug = action.payload.debug;

      // Update last history entry with the response
      const lastEntry = state.history[state.history.length - 1];
      if (lastEntry && lastEntry.question === action.meta.arg && lastEntry.response === '') {
        lastEntry.response = action.payload.response;
        lastEntry.debug = action.payload.debug;
      }
    })
    .addCase(sendQuestion.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;

      // Optionally update last entry with an error message if needed
    });
}

});

export const { clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;
