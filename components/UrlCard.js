'use client'

import { useState, useEffect } from 'react'

export default function UrlCard({ link, onDelete }) {
    const [origin, setOrigin] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => { setOrigin(window.location.origin) }, [])

    const shortUrl = `${origin}/${link.shortCode}`

    const copy = async () => {
        await navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="url-card">
            <div className="url-card-info">
                <div className="url-short">
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                </div>
                <div className="url-target">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <span title={link.targetUrl}>{link.targetUrl}</span>
                </div>
            </div>

            <div className="url-card-actions">
                <button className="card-btn" onClick={copy} title="Copy link">
                    {copied
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c78b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    }
                </button>
                <button
                    className="card-btn delete"
                    onClick={() => confirm('Delete this link?') && onDelete(link.id)}
                    title="Delete"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
