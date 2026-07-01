import { describe, it, expect, beforeAll } from 'vitest'
import { signToken, verifyToken } from '@/lib/token'

beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key'
})

describe('signToken / verifyToken', () => {
    it('signs and verifies a token', () => {
        const token = signToken({ id: 'user-123' })
        expect(typeof token).toBe('string')

        const payload = verifyToken(token)
        expect(payload).not.toBeNull()
        expect(payload.id).toBe('user-123')
    })

    it('returns null for an invalid token', () => {
        const payload = verifyToken('not.a.valid.token')
        expect(payload).toBeNull()
    })

    it('returns null for a tampered token', () => {
        const token = signToken({ id: 'user-456' })
        const tampered = token.slice(0, -5) + 'xxxxx'
        expect(verifyToken(tampered)).toBeNull()
    })
})
