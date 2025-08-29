import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const initialState = {
    value: null,
}

export const fetchUser = createAsyncThunk('user/fetchUser', async(token) => {
    const { data } = await api.get('/api/users/data', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data.success ? data.data : null;

})

export const updateUser = createAsyncThunk('user/update', async({ userData, token }) => {
    const { data } = await api.post('/api/users/update', userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (data.success) {
        toast.success(data.message);
        return data.user;
    }
    else {
        toast.error(data.message);
        return null;
    }
})




const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // builder is helpful to write reducer for AsyncThunk  
            // addCase -> buildIn method of builder object
            // state -> current slice
            // payload -> what asyncThunk returns
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.value = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.value = action.payload;
            })
    }
})

export const { } = userSlice.actions
export default userSlice.reducer
