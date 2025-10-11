import { createSlice } from "@reduxjs/toolkit"


const initState = {
    darkMode:(localStorage.getItem('theme') == "dark")
}


const themeSlice = createSlice({
    name: "theme",
    initialState: initState,
    reducers: {
        setChangeTheme(state, action) {
            state.darkMode = action.payload;
        },
    }
})


// export const { fetchUserData } = userListSlice.actions;
// export default userListSlice.reducer;

export const { setChangeTheme } = themeSlice.actions
export default themeSlice.reducer