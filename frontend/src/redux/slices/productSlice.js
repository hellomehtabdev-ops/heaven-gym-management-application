import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService, categoryService } from '@/services/productService';

const errorMessage = (error, fallback) => error.response?.data?.error || fallback;

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params = {}, { rejectWithValue }) => {
  try { return await productService.getActive(params); } catch (error) { return rejectWithValue(errorMessage(error, 'Failed to fetch products')); }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try { return await categoryService.getAll(); } catch (error) { return rejectWithValue(errorMessage(error, 'Failed to fetch categories')); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], categories: [], loading: false, error: null, total: 0, page: 1, pages: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.items = action.payload.rows || [];
        state.total = Number(action.payload.total) || 0;
        state.page = Number(action.payload.page) || 1;
        state.pages = Number(action.payload.pages) || 0;
        state.loading = false;
        state.currentRequestId = undefined;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.total = 0;
        state.pages = 0;
        state.currentRequestId = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export default productSlice.reducer;
