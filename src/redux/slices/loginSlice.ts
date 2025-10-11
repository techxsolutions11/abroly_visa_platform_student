import { createSlice } from "@reduxjs/toolkit"


const initState = {
    isLoading: true,
    token: null,
    role_type: null,
    authLoading: null,
    profileimage: null,
    email: null,
    user_name: null,
    phone:null,
}


const loginSlice = createSlice({
    name: "login",
    initialState: initState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        setRole(state, action) {
            state.role_type = action.payload;
        },
        setAuthLoading(state, action) {
            state.authLoading = action.payload;
        },
        setProfile(state, action) {
            state.profileimage = action.payload.profileimage;
            state.email = action.payload.email;
            state.user_name = action.payload.user_name;
            state.phone = action.payload.phone;
        },
        clearUserInfo(state, action) {
            state.isLoading = true;
            state.token = null;
            state.role_type = null;
            state.authLoading = null;
            state.profileimage = null;
            state.email = null;
            state.user_name = null;
            state.phone = null;
        }

    }
})


// export const { fetchUserData } = userListSlice.actions;
// export default userListSlice.reducer;

export const { setToken, setRole, setAuthLoading, setProfile,clearUserInfo } = loginSlice.actions
export default loginSlice.reducer