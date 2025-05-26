import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  supplier: string;
  price: number;
  category: string;
  stock: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts`); // Using posts as dummy data
      const products = response.data.map((item: any) => ({
        id: item.id,
        name: item.title,
        supplier: `Supplier ${item.id}`,
        price: Math.floor(Math.random() * 1000) + 100,
        category: `Category ${Math.floor(Math.random() * 5) + 1}`,
        stock: Math.floor(Math.random() * 100) + 10,
      }));
      return products;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
