import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch all materials
export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",
  async () => {
    const response = await axios.get(`${API_URL}/api/materials`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// Async thunk to fetch a single material by ID
export const fetchMaterialById = createAsyncThunk(
  "materials/fetchMaterialById", 
  async (id) => {
    const response = await axios.get(`${API_URL}/api/materials/${id}`,
      {
      headers: {
        Authorization: USER_TOKEN,
      },
    }
    );
    return response.data;
  }
);

// Async thunk to create a new material
export const createMaterial = createAsyncThunk(
  "materials/createMaterial",
  async (materialData) => {
    const response = await axios.post(
      `${API_URL}/api/materials`,
      materialData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to update an existing material
export const updateMaterial = createAsyncThunk(
  "materials/updateMaterial", 
  async ({ id, materialData }) => {
    const response = await axios.put(
      `${API_URL}/api/materials/${id}`,
      materialData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to delete a material
export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (id) => {
    await axios.delete(`${API_URL}/api/materials/${id}`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return id;
  }
);

const materialSlice = createSlice({
  name: "materials", 
  initialState: {
    materials: [],
    currentMaterial: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Materials
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch a Single Material by ID
      .addCase(fetchMaterialById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterialById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaterial = action.payload;
      })
      .addCase(fetchMaterialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Material
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.materials.push(action.payload);
      })
      // Update Material
      .addCase(updateMaterial.fulfilled, (state, action) => {
        const index = state.materials.findIndex(
          (material) => material._id === action.payload._id
        );
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
      })
      // Delete Material
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter(
          (material) => material._id !== action.payload
        );
      });
  },
});

export default materialSlice.reducer;
