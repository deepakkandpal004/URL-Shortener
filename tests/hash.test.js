import { describe, it, expect } from 'vitest'
import { hashPasswordWithSalt } from '@/lib/hash'

describe('hashPasswordWithSalt', () => {
    it('returns a salt and a hashed password', () => {
        const { salt, password } = hashPasswordWithSalt('mypassword')
        expect(salt).toBeTruthy()
        expect(password).toBeTruthy()
        expect(password).not.toBe('mypassword')
    })

    it('produces the same hash when given the same salt', () => {
        const { salt, password: first } = hashPasswordWithSalt('mypassword')
        const { password: second } = hashPasswordWithSalt('mypassword', salt)
        expect(first).toBe(second)
    })

    it('produces different hashes for different passwords', () => {
        const { salt } = hashPasswordWithSalt('password1')
        const { password: h1 } = hashPasswordWithSalt('password1', salt)
        const { password: h2 } = hashPasswordWithSalt('password2', salt)
        expect(h1).not.toBe(h2)
    })

    it('generates a different salt each call when not provided', () => {
        const { salt: s1 } = hashPasswordWithSalt('pass')
        const { salt: s2 } = hashPasswordWithSalt('pass')
        expect(s1).not.toBe(s2)
    })
})
