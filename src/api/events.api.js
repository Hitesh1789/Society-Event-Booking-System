import axiosClient from "./axiosClient";

const getAllUpcomingEvents = () => {
    return axiosClient.get("/event/upcoming")
}

const getEventInfo = (id) => {
    return axiosClient.get(`/event/${id}`)
}

const markEventComplete = (id)=>{
    return axiosClient.patch(`/event/${id}/complete`)
}

const updateEvent = (id,data)=>{
    console.log(data)
    return axiosClient.patch(`/event/${id}/update`,data)
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