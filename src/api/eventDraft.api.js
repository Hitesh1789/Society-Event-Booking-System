import axiosClient from "./axiosClient";

const createEventDraft = (data) => {
    return axiosClient.post("/event-draft",data)
}

const approveOrRejectDraft = (draftId,data) => {
    return axiosClient.post(`/event-draft/${draftId}/approval`,data)
}

const getPendingDrafts = () => {
    return axiosClient.get("/event-draft/pending")
}

const getDrafts = (socId) => {
    return axiosClient.get(`/event-draft/society/${socId}`)
}

const getDraftInfo = (draftId) => {
    return axiosClient.get(`/event-draft/${draftId}`)
}

const getDraftHistory = (draftId) => {
    return axiosClient.get(`/event-draft/history/${draftId}`)
}

export{
    createEventDraft,
    approveOrRejectDraft,
    getPendingDrafts,
    getDrafts,
    getDraftInfo,
    getDraftHistory
}