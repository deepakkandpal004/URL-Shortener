import { describe, it, expect, beforeAll } from 'vitest'
import { getUser, requireUser } from '@/lib/auth'
import { signToken } from '@/lib/token'

beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key'
})

function makeRequest(authHeader) {
    return { headers: { get: (key) => key === 'authorization' ? authHeader : null } }
}

describe('getUser', () => {
    it('returns null when no auth header', () => {
        expect(getUser(makeRequest(null))).toBeNull()
    })

    it('returns null when header does not start with Bearer', () => {
        expect(getUser(makeRequest('Token abc123'))).toBeNull()
    })

    it('returns null for an invalid token', () => {
        expect(getUser(makeRequest('Bearer invalidtoken'))).toBeNull()
    })

    it('returns payload for a valid token', () => {
        const token = signToken({ id: 'user-abc' })
        const user = getUser(makeRequest(`Bearer ${token}`))
        expect(user).not.toBeNull()
        expect(user.id).toBe('user-abc')
    })
})

describe('requireUser', () => {
    it('returns a 401 Response when not authenticated', () => {
        const { user, error } = requireUser(makeRequest(null))
        expect(user).toBeNull()
        expect(error).toBeInstanceOf(Response)
        expect(error.status).toBe(401)
    })

    it('returns the user when authenticated', () => {
        const token = signToken({ id: 'user-xyz' })
        const { user, error } = requireUser(makeRequest(`Bearer ${token}`))
        expect(error).toBeNull()
        expect(user.id).toBe('user-xyz')
    })
})
