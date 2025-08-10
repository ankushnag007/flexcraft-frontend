import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const UserMetaSlice = createSlice({
  name: 'UserMeta',
  initialState,
  reducers: {
    setUserMeta: (state, action) => {
      //   console.log({UserMetaAction: action});
      state.data = action.payload;
    },
    clearUserMeta: (state, action) => {
      state.data = null;
    },
  },
});

export const {setUserMeta, clearUserMeta} = UserMetaSlice.actions;

export default UserMetaSlice.reducer;
