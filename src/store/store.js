//✨🌸 Ganesh Sita Ram Waheguru Allah Hanuman Ji Mata Pita Ji Jai Kali Mata Shiv Shankar Hanuman Ji🌸✨
import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import societiesSlice from "./societiesSlice"
const store = configureStore({
    reducer : {
        auth : authSlice,
        society:societiesSlice
    }
})

export default store;
