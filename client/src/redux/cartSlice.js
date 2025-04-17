import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = (getState) => getState().auth.user.token;

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addItem = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.post(
        '/api/cart/add',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/remove',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, status: 'idle', error: null },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    // Added setCart to allow direct setting of cart state
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart cases
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload.items;
        state.total = payload.total;
      })
      .addCase(fetchCart.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload.message || 'Failed to fetch cart';
      })
      // addItem cases
      .addCase(addItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload.items;
        state.total = payload.total;
      })
      .addCase(addItem.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload.message || 'Failed to add item to cart';
      })
      // removeItem cases
      .addCase(removeItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload.items;
        state.total = payload.total;
      })
      .addCase(removeItem.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload.message || 'Failed to remove item from cart';
      });
  },
});

export const { clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
