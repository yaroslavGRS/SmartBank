import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios';

type User = {
  id: string;
  email: string;
  phone?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { identifier: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: { email: string; phone: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
