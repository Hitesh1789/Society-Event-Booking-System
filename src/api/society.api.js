import axiosClient from "./axiosClient";

const getSocieties = () => {
    return axiosClient.get("/society")
}

const getSocietyInfo = (id) => {
    return axiosClient.get(`/society/${id}`)
}

const createSociety = (data) => {
    return axiosClient.post("/society/create",data)
}

const joinSociety = (data) => {
    return axiosClient.post("/society/join",data)
}

const assignPresident = (id) => {
    return axiosClient.patch(`/society/${id}/assignPresident`)
}

const assignLead = (id) => {
    return axiosClient.patch(`/society/${id}/assignLead`)
}

const getMembers = (id) => {
    return axiosClient.get(`/society/${id}/getMembers`)
}

export {
    getSocieties,
    getSocietyInfo,
    createSociety,
    joinSociety,
    assignPresident,
    assignLead,
    getMembers
}