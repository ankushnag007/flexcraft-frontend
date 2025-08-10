import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const newMediaPostSlice = createSlice({
  name: 'NewMediaPost',
  initialState,
  reducers: {
    setNewMediaPost: (state, action) => {
      state.data = action.payload
    },
    clearNewMediaPost : (state) => {
      state.data = null
    }
  },
})


export const { setNewMediaPost, clearNewMediaPost } = newMediaPostSlice.actions

export default newMediaPostSlice.reducer