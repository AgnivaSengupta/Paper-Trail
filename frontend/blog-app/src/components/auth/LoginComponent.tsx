import { useState, type Dispatch, type SetStateAction } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useUserStore } from '@/store/userStore'
import axiosInstance from '@/utils/axiosInstance'
import { API_PATHS } from '@/utils/apiPaths'
import { useNavigate } from 'react-router-dom'

type LoginComponentProp = {
    setCurrentPage: Dispatch<SetStateAction<'login' | 'register'>>
}

const LoginComponent = ({setCurrentPage}: LoginComponentProp) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const updateUser = useUserStore((state) => state.updateUser);
    const setOpenAuthForm = useUserStore((state) => state.setOpenAuthForm);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // if (!validateEmail(email)){
        //     setError("Please enter a valid email address.");
        //     return;
        // }

        if (!password){
            setError("Please enter the password.");
            return;
        }

        // login api call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password})
            
            const { token, role }= response.data;
            if (token){
                localStorage.setItem("token", token);
                updateUser(response.data);
            }

            // redirect based on role
            if (role === "admin"){
                setOpenAuthForm(false);
                navigate('/admin/dashboard');
            }

            setOpenAuthForm(false);
            
        } catch (error) {
            if (error.response && error.response.data.msg){
                setError(error.response.data.msg);
            } else{
                setError("Something went wrong. Try again")
            }
        }
    }
  return (
    <div className='flex flex-col justify-center p-10'>
        <h1 className='mb-10'>Welcome Back !</h1>
        <div className='flex flex-col gap-8 mb-4'> 

            <form onSubmit={handleLogin}>
                <div>
                    <Label htmlFor='email' className='text-[15px] mb-3'>Enter your email</Label>
                    <Input 
                        id="email"
                        type="email" 
                        placeholder='Email'
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        />
                </div>

                <div>
                    <Label htmlFor='password' className='text-[15px] mb-3'>Password</Label>
                    <Input 
                        id='password' 
                        type='password' 
                        placeholder='Password'
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        />
                </div>

                <Button type='submit' variant='secondary' className='py-5 text-xl cursor-pointer'>Login</Button>
            </form>
        </div>
        <div className='text-xs'>Don't have an account? <span className='text-blue-300 cursor-pointer' onClick={() => setCurrentPage('register')}>Register now</span></div>
    </div>
  )
}

export default LoginComponent