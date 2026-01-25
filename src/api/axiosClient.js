import axios from 'axios';
const apiUrl  = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials:true,
});

axiosClient.interceptors.request.use( 
    (config)=>config,
    (error)=>{
        console.log("Api Error:",error);
        Promise.reject(error);
    }
);

export default axiosClient;