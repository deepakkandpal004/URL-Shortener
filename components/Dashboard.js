'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import UrlCard from './UrlCard'

export default function Dashboard() {
    const router = useRouter()
    const [urls, setUrls]         = useState([])
    const [url, setUrl]           = useState('')
    const [alias, setAlias]       = useState('')
    const [showAlias, setShowAlias] = useState(false)
    const [result, setResult]     = useState(null)
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [copied, setCopied]     = useState(false)
    const [origin, setOrigin]     = useState('')

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    useEffect(() => {
        if (!token) { router.replace('/login'); return }
        setOrigin(window.location.origin)
        fetchUrls()
    }, [])

    const fetchUrls = useCallback(async () => {
        try {
            const res = await fetch('/api/codes', { headers: { Authorization: `Bearer ${token}` } })
            const data = await res.json()
            setUrls(data.codes || [])
        } catch { setUrls([]) }
    }, [token])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        router.replace('/login')
    }

    const shorten = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const body = { url }
            if (alias.trim()) body.code = alias.trim()

            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            const path = `/${data.shortCode}`
            setResult({ path, full: origin + path })
            setUrl('')
            setAlias('')
            setShowAlias(false)
            fetchUrls()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const copy = async (text) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const deleteUrl = async (id) => {
        await fetch(`/api/urls/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setUrls(u => u.filter(x => x.id !== id))
    }

    const apiHost = origin ? new URL(origin).host : ''

    return (
        <div className="dashboard">

            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-inner">
                    <div className="logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ng)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#A464EE" />
                                    <stop offset="100%" stopColor="#607DEA" />
                                </linearGradient>
                            </defs>
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        ShortLink
                    </div>
                    <div className="nav-right">
                        <div className="avatar">U</div>
                        <button className="btn btn-outline" onClick={logout}>Logout</button>
                    </div>
                </div>
            </nav>

            {/* Body */}
            <div className="dashboard-body">

                {/* Hero */}
                <section className="hero">
                    <h1>Shorten. Share. <span className="gradient-text">Simplify.</span></h1>
                    <p>Paste a long URL and get a clean short link instantly.</p>
                </section>

                {/* Shortener */}
                <div className="shortener-box">
                    <form onSubmit={shorten}>
                        <div className="input-row">
                            <input
                                type="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://your-very-long-url.com/goes/here"
                                required
                            />

                            <div className={`alias-row${showAlias ? '' : ' collapsed'}`}>
                                <div className="alias-input-wrapper">
                                    <span className="alias-prefix">{apiHost}/</span>
                                    <input
                                        className="alias-input"
                                        type="text"
                                        value={alias}
                                        onChange={e => setAlias(e.target.value)}
                                        placeholder="custom-alias"
                                        maxLength={20}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="shortener-actions">
                            <button
                                type="button"
                                className="btn-text"
                                onClick={() => { setShowAlias(s => !s); setAlias('') }}
                            >
                                {showAlias ? '− Remove alias' : '+ Custom alias'}
                            </button>
                            <button
                                type="submit"
                                className={`btn btn-primary${loading ? ' loading' : ''}`}
                                disabled={loading}
                            >
                                <span>Shorten</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>

                        {error && <p className="inline-error">{error}</p>}
                    </form>

                    {result && (
                        <div className="result-banner">
                            <div style={{ overflow: 'hidden' }}>
                                <p className="result-label">Ready to share</p>
                                <a className="result-link" href={result.full} target="_blank" rel="noopener noreferrer">
                                    {result.full}
                                </a>
                            </div>
                            <button
                                className={`btn-icon${copied ? ' copied' : ''}`}
                                onClick={() => copy(result.full)}
                                title="Copy"
                            >
                                {copied
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c78b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                }
                            </button>
                        </div>
                    )}
                </div>

                {/* Links list */}
                <section className="links-section">
                    <div className="links-header">
                        <h2>Your links</h2>
                        <span className="badge">{urls.length}</span>
                    </div>

                    <div className="links-list">
                        {urls.length === 0 ? (
                            <div className="empty">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <h3>No links yet</h3>
                                <p>Your shortened URLs will appear here.</p>
                            </div>
                        ) : (
                            [...urls]
                                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                                .map(link => (
                                    <UrlCard key={link.id} link={link} onDelete={deleteUrl} />
                                ))
                        )}
                    </div>
                </section>
            </div>

            <footer className="footer">&copy; 2026 ShortLink</footer>
        </div>
    )
}
