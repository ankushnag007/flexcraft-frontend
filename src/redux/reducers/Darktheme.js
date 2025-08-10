import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: 'dark',
};

export const themeSlice = createSlice({
  name: 'Darktheme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {setTheme} = themeSlice.actions;

export default themeSlice.reducer;
