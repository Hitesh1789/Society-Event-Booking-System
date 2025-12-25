import axiosClient from "./axiosClient";

const getAllUpcomingEvents = () => {
    return axiosClient.get("/event/upcoming")
}

const getEventInfo = (id) => {
    return axiosClient.get(`/event/${id}`)
}

const markEventComplete = (id)=>{
    return axiosClient.patch(`/event/${id}/cancel`)
}

const updateEvent = (id)=>{
    return axiosClient.patch(`/event/${id}/update`)
}

const cancelEvent = (id)=>{
    return axiosClient.patch(`/event/${id}/cancel`)
}

export{
    getAllUpcomingEvents,
    getEventInfo,
    markEventComplete,
    updateEvent,
    cancelEvent
}