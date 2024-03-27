import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return  action.payload
    },
    hideNotification(){
      return null
    }
  },
})

export const showNotification = (message, timer) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(hideNotification()), timer * 1000)
  }
}

export const { setNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer