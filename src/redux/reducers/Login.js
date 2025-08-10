import {createSlice, createAction, createReducer} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const loginSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      console.log(state,action.payload, "check action payload");
      state.data = action.payload;
    },
    updateLogin: (state, action) => {
      state.data.email = action.payload;

    },
    clearLogin: state => {
      state.data = null;
    },
  },
});

export const {setLogin, updateLogin, clearLogin} = loginSlice.actions;

export default loginSlice.reducer;
