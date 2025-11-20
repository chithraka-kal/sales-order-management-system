import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesService } from '../../services/salesService';

// Async Thunks
export const fetchOrders = createAsyncThunk('sales/fetchOrders', async () => {
  const response = await salesService.getAll();
  return response.data;
});

export const saveOrder = createAsyncThunk('sales/saveOrder', async (orderData, { rejectWithValue }) => {
  try {
    if (orderData.id) {
      await salesService.update(orderData.id, orderData); // PUT
    } else {
      await salesService.create(orderData); // POST
    }
    return;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  list: [], // Screen 2 Data
  status: 'idle',
  // Screen 1 Form State
  currentOrder: {
    id: null, 
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    customerId: '',
    customerDetails: {}, 
    items: [] 
  }
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    
    resetCurrentOrder: (state) => {
      state.currentOrder = {
        id: null,
        invoiceNo: "INV-" + Date.now(),
        invoiceDate: new Date().toISOString().split('T')[0],
        customerId: '',
        customerDetails: {},
        items: []
      };
    },
    setCurrentOrder: (state, action) => {
      
      const data = action.payload;
      state.currentOrder = {
        id: data.id,
        invoiceNo: data.invoiceNo,
        invoiceDate: data.invoiceDate.split('T')[0],
        customerId: data.customerId,
        customerDetails: data.customer || {},
        items: data.items.map(i => ({ ...i, tempId: i.id || Math.random() }))
      };
    },
    updateHeader: (state, action) => {
      state.currentOrder = { ...state.currentOrder, ...action.payload };
    },
    setItems: (state, action) => {
      state.currentOrder.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export const { resetCurrentOrder, setCurrentOrder, updateHeader, setItems } = salesSlice.actions;
export default salesSlice.reducer;