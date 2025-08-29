import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    connections: [],
    pendingConnections: [], 
    followers: [],
    following: []
}

export const fetchConnections = createAsyncThunk('connections/fetchConnections', async(token) => {
    const {data} = await api.get('/api/users/connections', {
        headers: {Authorization: `Bearer ${token}`},
    })
    return data.success ? data : null;
})

const connectionSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        clearConnections: (state) => {
            state.connections = [];
            state.pendingConnections = [];
            state.followers = [];
            state.following = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnections.fulfilled, (state, action) => {
                if (action.payload) {
                    state.connections = action.payload.connections || [];
                    state.pendingConnections = action.payload.pendingConnections || [];
                    state.followers = action.payload.followers || [];
                    state.following = action.payload.following || [];
                }
            })
            .addCase(fetchConnections.rejected, (state, action) => {
                console.error('Failed to fetch connections:', action.error);
                // Keep existing state on error
            })
    }
})

export const { clearConnections } = connectionSlice.actions
export default connectionSlice.reducer
