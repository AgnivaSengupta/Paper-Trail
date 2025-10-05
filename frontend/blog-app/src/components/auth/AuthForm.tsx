import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignUpForm'

const AuthForm = () => {

    const [authState, setAuthState] = useState<'signup' | 'login'>('login')
    return (
        <div>
            {authState === 'login' ? <LoginForm authState={authState} setAuthState={setAuthState} />
                :
                <SignupForm authState={authState} setAuthState={setAuthState}/>
            }
        </div>
    )
}

export default AuthForm