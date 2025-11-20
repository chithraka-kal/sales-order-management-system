import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],     // For Screen 2 (List)
  currentOrder: {}, // For Screen 1 (Edit/Create)
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    // We will add more actions here later
  },
});

export const { setOrders } = salesSlice.actions;
export default salesSlice.reducer;