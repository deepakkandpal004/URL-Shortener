import AuthForm from '@/components/AuthForm'
import { Suspense } from 'react'

export const metadata = { title: 'Login | ShortLink' }

export default function LoginPage() {
    return (
        <Suspense>
            <AuthForm mode="login" />
        </Suspense>
    )
}
