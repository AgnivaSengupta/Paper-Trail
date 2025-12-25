import { useState, type Dispatch, type SetStateAction } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import axiosInstance from '@/utils/axiosInstance'
import { API_PATHS } from '@/utils/apiPaths'
import { useNavigate } from 'react-router-dom'

type LoginComponentProp = {
    setCurrentPage: Dispatch<SetStateAction<'login' | 'register'>>
}

const LoginComponent = ({setCurrentPage}: LoginComponentProp) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const setUser = useAuthStore((state) => state.setUser);
    const setAuthFormOpen = useAuthStore((state) => state.setAuthFormOpen);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password){
            setError("Please fill in all fields.");
            return;
        }

        // login api call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password})
            
            const userData = response.data;
            setUser(userData);
            setAuthFormOpen(false);

            // redirect based on role
            if (userData.role === "admin"){
                navigate('/admin/overview');
            }
            
        } catch (error: any) {
            if (error.response && error.response.data.msg){
                setError(error.response.data.msg);
            } else{
                setError("Something went wrong. Try again")
            }
        }
    }
    return (
        <div className='flex flex-col justify-center p-10'>
            <h1 className='mb-10 text-2xl font-bold'>Welcome Back!</h1>
            {error && <div className='mb-4 text-red-500 text-sm'>{error}</div>}
            <form onSubmit={handleLogin} className='flex flex-col gap-6 mb-6'> 
                <div>
                    <Label htmlFor='email' className='text-[15px] mb-2 block'>Enter your email</Label>
                    <Input 
                        id="email"
                        type="email" 
                        placeholder='Email'
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor='password' className='text-[15px] mb-2 block'>Password</Label>
                    <Input 
                        id='password' 
                        type='password' 
                        placeholder='Password'
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        required
                    />
                </div>

                <Button type='submit' variant='secondary' className='py-6 text-lg cursor-pointer'>Login</Button>
            </form>
            <div className='text-sm text-center'>
                Don't have an account? <span className='text-blue-400 cursor-pointer hover:underline' onClick={() => setCurrentPage('register')}>Register now</span>
            </div>
        </div>
    )
}

export default LoginComponent
