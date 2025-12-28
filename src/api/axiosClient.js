import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
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