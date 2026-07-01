import AuthForm from '@/components/AuthForm'
import { Suspense } from 'react'

export const metadata = { title: 'Sign Up | ShortLink' }

export default function RegisterPage() {
    return (
        <Suspense>
            <AuthForm mode="register" />
        </Suspense>
    )
}
