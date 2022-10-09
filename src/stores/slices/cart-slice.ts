import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mergeArrayOfObjects } from 'src/utils/helpers';
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
    addToCart: (state, action: PayloadAction<IProduct>) => {
      const newProducts = [action.payload];
      const oldProducts = state.items;
      const mergedProducts = mergeArrayOfObjects<IProduct>(oldProducts, newProducts);
      console.log({ newProducts, oldProducts, mergedProducts });
      state.items = mergedProducts;
      state.itemCount = mergedProducts.length;
    },
    deleteFromCart: (state, action) => {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      state.items = newItems || [];
      state.itemCount = newItems.length;
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
    }
  },
});

export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
