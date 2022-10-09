import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { DBUserSchema } from 'src/schema/user.schema';

interface IUserState {
    user: DBUserSchema | null,
    userId: string | null;
}

const initialState: IUserState = {
    user: null,
    userId: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<DBUserSchema>) => {
            console.log({ user: action.payload });
            state.user = action.payload;
            state.userId = action.payload.id;
        },
        removeUser: (state) => {
            state.user = null;
            state.userId = null;
        }
    }
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;