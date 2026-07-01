import { z } from 'zod'
import db from '@/lib/db'
import { urlsTable } from '@/models/url'
import { requireUser } from '@/lib/auth'
import { and, eq } from 'drizzle-orm'

export async function DELETE(request, { params }) {
    const { user, error } = requireUser(request)
    if (error) return error

    const { id } = await params
    await db.delete(urlsTable).where(and(eq(urlsTable.id, id), eq(urlsTable.userId, user.id)))
    return Response.json({ message: 'Deleted' })
}

const schema = z.object({
    url:  z.string().url().optional(),
    code: z.string().optional(),
}).refine(d => d.url || d.code, { message: 'Provide at least one field' })

export async function PATCH(request, { params }) {
    const { user, error } = requireUser(request)
    if (error) return error

    const { id } = await params
    const body = await request.json()
    const result = schema.safeParse(body)
    if (!result.success) {
        return Response.json({ error: result.error.format() }, { status: 400 })
    }

    const fields = {}
    if (result.data.url)  fields.targetUrl  = result.data.url
    if (result.data.code) fields.shortCode  = result.data.code

    try {
        const [updated] = await db
            .update(urlsTable)
            .set(fields)
            .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, user.id)))
            .returning()

        if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json({ id: updated.id, targetUrl: updated.targetUrl, shortCode: updated.shortCode })
    } catch (e) {
        if (e.code === '23505') return Response.json({ error: 'Short code already taken' }, { status: 409 })
        return Response.json({ error: e.message }, { status: 500 })
    }
}
