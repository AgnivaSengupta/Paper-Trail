import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { API_PATHS } from "@/utils/apiPaths"
import { useAuthStore } from "@/store/useAuthStore"

export function LoginForm({ authState, setAuthState } : { authState: "signup" | "login", setAuthState: React.Dispatch<React.SetStateAction<"signup" | "login">>}) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const setAuthFormOpen = useAuthStore((state) => state.setAuthFormOpen)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password){
            alert("Enter all the fields");
            return
        }

        const payload = {
            email,
            password,
        }

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, payload, {withCredentials: true});
            alert("Login successful")
            setAuthFormOpen(false)
            console.log(response.data)
            useAuthStore.getState().setUser(response.data)
        } catch (error) {
            alert("Login failed")
            console.log("Error: ", error)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </Field>
                            <Field>
                                <Button type="submit" className="bg-primary text-foreground hover:bg-primary/80 cursor-pointer">Login</Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Button variant='link' className="cursor-pointer" onClick={() => setAuthState('signup')}>Sign up</Button>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
