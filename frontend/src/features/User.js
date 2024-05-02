import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userId: null,
  token: null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/register",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/api/login",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.userId = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.userId = action.payload.id;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "logged in";
        state.userId = action.payload.id;
        state.token = action.payload.token;
        state.error = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload.message;
      });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
