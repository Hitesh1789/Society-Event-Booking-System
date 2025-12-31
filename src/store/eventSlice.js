import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events : [],
}

const eventSlice = createSlice({
    name : "event",
    initialState,
    reducers : {
        addEvents: (state,action)=>{
            state.events = [...action.payload.events]
        },
        addEvent : (state,action)=>{
           state.events.push(action.payload);
        },
        deleteEvent  : (state,action)=>{
            state.events = state.events.filter((event)=>(event.id!==action.payload.id))
        },
        updateEvent : (state,action)=>{
            state.events = state.events.map((event)=>(
                (action.payload.id==event.id) ? action.payload.updatedEvent: event
            ))
        },
        clearEvents: (state)=>{
            state.events = [];
        }
    }
})

export const {addEvent,addEvents,deleteEvent,updateEvent,clearEvents} = eventSlice.actions;

export default eventSlice.reducer;