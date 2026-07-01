import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// mirrors the schemas used in route handlers
const signUpSchema = z.object({
    firstname: z.string(),
    lastname:  z.string().optional(),
    email:     z.string().email(),
    password:  z.string().min(3),
})

const loginSchema = z.object({
    email:    z.string().email(),
    password: z.string().min(3),
})

const shortenSchema = z.object({
    url:  z.string().url(),
    code: z.string().optional(),
})

describe('sign-up schema', () => {
    it('passes with valid data', () => {
        const r = signUpSchema.safeParse({ firstname: 'John', email: 'john@test.com', password: 'abc' })
        expect(r.success).toBe(true)
    })

    it('fails with invalid email', () => {
        const r = signUpSchema.safeParse({ firstname: 'John', email: 'not-an-email', password: 'abc' })
        expect(r.success).toBe(false)
    })

    it('fails with password too short', () => {
        const r = signUpSchema.safeParse({ firstname: 'John', email: 'j@test.com', password: 'ab' })
        expect(r.success).toBe(false)
    })
})

describe('login schema', () => {
    it('passes with valid credentials', () => {
        const r = loginSchema.safeParse({ email: 'a@b.com', password: 'abc' })
        expect(r.success).toBe(true)
    })

    it('fails without email', () => {
        const r = loginSchema.safeParse({ password: 'abc' })
        expect(r.success).toBe(false)
    })
})

describe('shorten schema', () => {
    it('passes with a valid URL', () => {
        const r = shortenSchema.safeParse({ url: 'https://example.com' })
        expect(r.success).toBe(true)
    })

    it('passes with a custom code', () => {
        const r = shortenSchema.safeParse({ url: 'https://example.com', code: 'my-code' })
        expect(r.success).toBe(true)
    })

    it('fails with a non-URL string', () => {
        const r = shortenSchema.safeParse({ url: 'not-a-url' })
        expect(r.success).toBe(false)
    })
})
