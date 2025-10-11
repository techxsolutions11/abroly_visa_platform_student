import { getFromLocal } from "@/utils/localstorage";
import { createSlice } from "@reduxjs/toolkit"


const initState = {
    latitude: getFromLocal("latitude") || '',
    longitude: getFromLocal("longitude") || '',
    area: getFromLocal("area") || '',
}


const userLocationSlice = createSlice({
    name: "user_location",
    initialState: initState,
    reducers: {
        setLatitude(state, action) {
            state.latitude = action.payload;
        },
        setLongitude(state, action) {
            state.longitude = action.payload;
        },
        setArea(state, action) {
            state.area = action.payload;
        },
        clearUserInfo(state, action) {
            state.latitude = '';
            state.longitude = '';
            state.area = '';
        }
    }
})


// export const { fetchUserData } = userListSlice.actions;
// export default userListSlice.reducer;

export const { clearUserInfo,setLatitude,setLongitude,setArea } = userLocationSlice.actions
export default userLocationSlice.reducer