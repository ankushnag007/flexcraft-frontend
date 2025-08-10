import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const schedulePostSlice = createSlice({
  name: 'SchedulePost',
  initialState,
  reducers: {
    setSchedulePost: (state, action) => {
      state.data = action.payload
    },
    clearSchedulePost : (state) => {
      state.data = null
    }
  },
})
export const { setSchedulePost, clearSchedulePost } = schedulePostSlice.actions
export default schedulePostSlice.reducer