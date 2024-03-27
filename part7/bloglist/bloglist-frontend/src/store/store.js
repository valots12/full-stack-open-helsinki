import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../reducers/loginReducer'
import blogReducer from '../reducers/blogReducer'
import notificationReducer from '../reducers/notificationReducer'

const store = configureStore({
  reducer: {
    user: loginReducer,
    values: blogReducer,
    notification: notificationReducer
  }
})

export default store