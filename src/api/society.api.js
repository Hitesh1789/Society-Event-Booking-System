import axiosClient from "./axiosClient";

const getSocieties = () => {
    return axiosClient.get("/society")
}

const getSocietyInfo = (id) => {
    return axiosClient.get(`/society/${id}`)
}

const createSociety = () => {
    return axiosClient.get("/society/create")
}

const joinSociety = () => {
    return axiosClient.get("/society/join")
}

const assignPresident = (id) => {
    return axiosClient.get(`/society/${id}/assignPresident`)
}

const assignLead = (id) => {
    return axiosClient.get(`/society/${id}/assignLead`)
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