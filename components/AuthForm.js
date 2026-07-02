'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthForm({ mode }) {
    const router = useRouter()
    const params = useSearchParams()
    const isLogin = mode === 'login'

    const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('token')) router.replace('/')
        if (isLogin && params.get('registered')) setSuccess('Account created! Sign in now.')
    }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        const endpoint = isLogin ? '/api/user/login' : '/api/user/sign-up'
        const body = isLogin
            ? { email: form.email, password: form.password }
            : { firstname: form.firstname, lastname: form.lastname || undefined, email: form.email, password: form.password }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            let data
            try {
                data = await res.json()
            } catch {
                throw new Error('Server error — please try again')
            }

            if (!res.ok) throw new Error(data.error || 'Something went wrong')

            if (isLogin) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userId', data.userId)
                router.replace('/')
            } else {
                router.replace('/login?registered=true')
            }
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">

                {/* Brand */}
                <div className="auth-brand">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ag)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                            <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#A464EE" />
                                <stop offset="100%" stopColor="#607DEA" />
                            </linearGradient>
                        </defs>
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    ShortLink
                </div>

                {/* Heading */}
                <div className="auth-heading">
                    <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                    <p>{isLogin ? 'Sign in to your dashboard' : 'Start shortening links today'}</p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={submit}>
                    {!isLogin && (
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First name</label>
                                <input type="text" required placeholder="John" value={form.firstname} onChange={set('firstname')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last name</label>
                                <input type="text" placeholder="Doe" value={form.lastname} onChange={set('lastname')} />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" required placeholder="••••••••" minLength={isLogin ? 3 : 6} value={form.password} onChange={set('password')} />
                    </div>

                    {error   && <p className="msg msg-error">{error}</p>}
                    {success && <p className="msg msg-success">{success}</p>}

                    <button
                        type="submit"
                        className={`btn btn-primary btn-full${loading ? ' loading' : ''}`}
                        disabled={loading}
                        style={{ marginTop: '0.25rem' }}
                    >
                        <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Link href={isLogin ? '/register' : '/login'}>
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
