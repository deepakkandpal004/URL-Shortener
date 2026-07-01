import db from '@/lib/db'
import { urlsTable } from '@/models/url'
import { requireUser } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function GET(request) {
    const { user, error } = requireUser(request)
    if (error) return error

    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, user.id))
    return Response.json({ codes })
}
