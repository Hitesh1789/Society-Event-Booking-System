import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import societiesSlice from "./societiesSlice";
import eventSlice from "./eventSlice"
const store = configureStore({
    reducer : {
        auth : authSlice,
        society:societiesSlice,
        event: eventSlice
    }
})

export default store;
