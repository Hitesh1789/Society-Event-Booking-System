import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    societies : [],
}

const societiesSlice = createSlice({
    name : "society",
    initialState,
    reducers : {
        addSocieties : (state,action)=>{
            state.societies = [...action.payload.societies]
        },
        addSociety : (state,action)=>{
           state.societies.push(action.payload);
        },
        deleteSociety  : (state,action)=>{
            state.societies = state.societies.filter((society)=>(society.id!==action.payload.id))
        },
        updateSociety  : (state,action)=>{
            state.societies = state.posts.map((society)=>(
                (action.payload.id==society.id) ? action.payload.updatedSociety: society
            ))
        },
        clearSocieties : (state)=>{
            state.societies = [];
        }
    }
})

export const {addSocieties,addSociety,deleteSociety,updateSociety,clearSocieties} = societiesSlice.actions;

export default societiesSlice.reducer;