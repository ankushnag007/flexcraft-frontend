import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const newPostSlice = createSlice({
  name: 'NewChild',
  initialState,
  reducers: {
    setNewChild: (state, action) => {
      state.data = action.payload
    },
    clearNewPost : (state) => {
      state.data = null
    }
  },
})


export const { setNewChild, clearNewPost } = newPostSlice.actions

export default newPostSlice.reducer