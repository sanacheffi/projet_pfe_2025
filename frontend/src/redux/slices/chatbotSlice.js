import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// LocalStorage helpers
const CHAT_HISTORY_KEY = 'chatbot_history';

function loadHistory() {
  try {
    const serialized = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!serialized) return [];
    return JSON.parse(serialized);
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore write errors
  }
}

// Async thunk for sending question
export const sendQuestion = createAsyncThunk(
  'chatbot/sendQuestion',
  async (question, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        { question }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors de la communication avec le chatbot.'
      );
    }
  }
);

const initialState = {
  question: '',
  response: '',
  loading: false,
  error: null,
  debug: null,
  history: loadHistory(),
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearChat(state) {
      state.question = '';
      state.response = '';
      state.debug = null;
      state.error = null;
      state.history = [];
      saveHistory(state.history); // clear localStorage too
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQuestion.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.response = '';
        state.question = action.meta.arg;

        // Add user's question with empty response to history
        state.history.push({
          question: action.meta.arg,
          response: '',
          debug: null,
        });
        saveHistory(state.history);
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
        saveHistory(state.history);
      })
      .addCase(sendQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        saveHistory(state.history);
      });
  },
});

export const { clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;
