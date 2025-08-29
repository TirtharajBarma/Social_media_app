import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import messageReducer from '../features/messages/messageSlice.js'
import connectionReducer from '../features/connections/connectionSlice.js'

export const store = configureStore({
  reducer: {
    // your reducers here
    user: userReducer,
    messages: messageReducer,
    connections: connectionReducer
  }
});