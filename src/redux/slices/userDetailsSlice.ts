import { createSlice } from "@reduxjs/toolkit";

const initValues = {
    details: {},
    loading:true
}

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: initValues,
    reducers: {
        setUserDetails(state, action) {
            state.details = action.payload
        },
        clearUserDetails(state) {
            state.details = {};
        },
        setLoading(state,action){
            state.loading = action.payload
        }
    }
})


export const {setUserDetails,clearUserDetails,setLoading} = userDetailsSlice.actions
export  default userDetailsSlice.reducer;