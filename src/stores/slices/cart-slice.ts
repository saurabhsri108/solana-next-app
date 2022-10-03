import { createSlice } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces/product";

interface ICartState {
  items: IProduct[];
  itemCount: number;
}

const initialState: ICartState = {
  items: [],
  itemCount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      state.itemCount += 1;
    },
    deleteFromCart: (state, action) => {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      state.items = newItems || [];
      state.itemCount -= 1;
    },
  },
});

export const { addToCart, deleteFromCart } = cartSlice.actions;
export default cartSlice.reducer;
