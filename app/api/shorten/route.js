import { z } from 'zod'
import { nanoid } from 'nanoid'
import db from '@/lib/db'
import { urlsTable } from '@/models/url'
import { requireUser } from '@/lib/auth'

const schema = z.object({
    url:  z.string().url(),
    code: z.string().optional(),
})

export async function POST(request) {
    const { user, error } = requireUser(request)
    if (error) return error

    const body = await request.json()
    const result = schema.safeParse(body)
    if (!result.success) {
        return Response.json({ error: result.error.format() }, { status: 400 })
    }

    const { url, code } = result.data
    const shortCode = code ?? nanoid(6)

    try {
        const [created] = await db
            .insert(urlsTable)
            .values({ shortCode, targetUrl: url, userId: user.id })
            .returning()

        return Response.json({
            id: created.id,
            shortCode: created.shortCode,
            targetUrl: created.targetUrl,
        }, { status: 201 })
    } catch (e) {
        if (e.code === '23505') {
            return Response.json({ error: 'Short code already taken' }, { status: 409 })
        }
        return Response.json({ error: e.message }, { status: 400 })
    }
}
