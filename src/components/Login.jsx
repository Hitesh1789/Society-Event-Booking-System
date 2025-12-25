import {useState} from "react";
import {Input,Button} from "./index"
import { useDispatch } from "react-redux";
import {Link,useNavigate} from "react-router-dom"
import {login as authLogin} from "../store/authSlice"
import {useForm} from "react-hook-form"
import { Calendar } from "lucide-react";
import { loginUser ,getUser} from "../api/user.api";
function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register,handleSubmit} = useForm();
    const [error,setError] = useState("");
    
    const login = async (data)=>{
        setError("") // filling new error if any by removing prevoius
        try{
            const res = await loginUser(data);
            // console.log("Login:\n",res)
            if(res){
                const userData = await getUser();
                if(userData) dispatch(authLogin(userData.data.data))
                // console.log(userData.data.data)
                navigate('/dashboard')
            }
        }catch(error){
            setError(error.message);
        }
    }
    
    return(
        <div className='flex items-center justify-center w-full'>
            <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
                <div className="mb-2 flex justify-center text-purple-600 font-semibold text-xl ">
                    <Calendar/>
                    <span className='p-1'/> EventMitra
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign into your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link to={'/signup'} 
                     className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                        label="Email : "
                        placeholder = "Enter your email"
                        type = "email"
                        {...register("email",{
                            required : true,
                            validate : {
                                matchPattern : (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be valid address"
                            }
                        })}
                        />

                        <Input
                        label="Password : "
                        placeholder = "Enter your password"
                        type = "password"
                        {...register("password",{
                            required : true
                        })}
                        />

                        <Button 
                        type="submit"
                        classname="w-full cursor-pointer"
                        >Sign In</Button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default Login;