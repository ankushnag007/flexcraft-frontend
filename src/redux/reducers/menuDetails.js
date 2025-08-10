import {createSlice, createAction, createReducer} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const menuDetailsSlice = createSlice({
  name: 'menuDetails',
  initialState,
  reducers: {
    setMenuDetails: (state, action) => {
      console.log(state,action.payload, "check action payload menudetails");
      state.data = action.payload;
    },
    
  },
});

export const {setMenuDetails} = setMenuDetails.actions;

export default menuDetailsSlice.reducer;
