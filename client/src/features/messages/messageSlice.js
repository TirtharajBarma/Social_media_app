import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    messages: [],
}

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(msg => msg.id !== action.payload.id)
        },
        clearMessages: (state) => {
            state.messages = []
        }
    }
})

export const { addMessage, removeMessage, clearMessages } = messageSlice.actions
export default messageSlice.reducer
