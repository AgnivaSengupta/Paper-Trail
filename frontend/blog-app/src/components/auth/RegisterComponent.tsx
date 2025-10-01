import React, { type Dispatch, type SetStateAction } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type RegisterComponentProps = {
    setCurrentPage: Dispatch<SetStateAction<'login' | 'register'>>;
  };

const RegisterComponent = ({setCurrentPage}: RegisterComponentProps) => {
  return (
      <div className='flex flex-col justify-center p-10'>
          <h1 className='mb-10'>Create an Account</h1>
          <div className='flex flex-col gap-8 mb-4'>

            <div>
                <Label htmlFor='username' className='text-[15px] mb-3'>Username</Label>
                <Input id='username' type='text'/>
            </div>

              <div>
                  <Label htmlFor='email' className='text-[15px] mb-3'>Email</Label>
                  <Input id="email" type="email" placeholder='Email' />
              </div>

              <div>
                  <Label htmlFor='password' className='text-[15px] mb-3'>Password</Label>
                  <Input id='password' type='password' placeholder='Password' />
              </div>

              <Button variant='secondary' className='py-5 text-xl cursor-pointer'>Login</Button>
          </div>
          <div className='text-xs'>Already have an account ? <span className='text-blue-300 cursor-pointer' onClick={() => setCurrentPage('login')}> Login</span></div>
      </div>
  )
}

export default RegisterComponent