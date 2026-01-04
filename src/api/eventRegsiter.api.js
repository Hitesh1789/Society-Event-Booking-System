import axiosClient from "./axiosClient";

const getMyRegisterations = () => {
    return axiosClient.get("/event-register/my")
}

const registerEvent = (eventId)=>{
    return axiosClient.post(`/event-register/${eventId}/register`)
}

const cancelRegistration = (eventId)=>{
    return axiosClient.patch(`/event-register/${eventId}/cancel`)
}

// Get all registrations for a event => authorised to only society_members
const getRegistrations = (eventId)=>{
    return axiosClient.get(`/event-register/${eventId}/getRegistrations`)
}

export{
    getMyRegisterations,
    registerEvent,
    cancelRegistration,
    getRegistrations
}

