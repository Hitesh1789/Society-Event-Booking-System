import axiosClient from "./axiosClient"; 

const submitEventFeedback = (eventId,data)=>{
    return axiosClient.post(`/event-feedback/${eventId}`,data)
}

const getEventSummary = (eventId)=>{
    return axiosClient.get(`/event-feedback/${eventId}/summary`)
}

export{
    submitEventFeedback,
    getEventSummary
}