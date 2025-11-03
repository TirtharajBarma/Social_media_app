import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    messages: [],
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async({token, userId}) => {
    const {data} = await api.post('/api/messages/get', {to_user_id: userId}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data.success ? data : null;
})

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        removeMessage: (state, action) => {
            // Remove a message by its _id passed in action.payload
            state.messages = state.messages.filter(m => m._id !== action.payload);
        },
        resetMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.fulfilled, (state, action) => {
                if(action.payload) {
                    state.messages = action.payload.messages;
                }
            })
    }
})

export const { addMessage, removeMessage, resetMessages } = messageSlice.actions
export default messageSlice.reducer
