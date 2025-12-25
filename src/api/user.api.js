import axiosClient from "./axiosClient";

const signupUser = (data)=>{
    return axiosClient.post("users/signup",data)
}

const loginUser = (data)=>{
    return axiosClient.post("users/login",data)
}

const logoutUser = ()=>{
    return axiosClient.post("users/logout")
}

const getUser = ()=>{
    return axiosClient.get("users/me")
}

const changeUserPassword = (data)=>{
    return axiosClient.patch("users/changePassword",data)
}

const updateUserProfile = (data)=>{
    return axiosClient.patch("users/updateProfile",data)
}

export {
    signupUser,
    loginUser,
    logoutUser,
    getUser,
    changeUserPassword,
    updateUserProfile
}