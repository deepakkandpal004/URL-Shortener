import db from '@/lib/db'
import { urlsTable } from '@/models/url'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function GET(request, { params }) {
    const { code } = await params

    const [result] = await db
        .select({ targetUrl: urlsTable.targetUrl })
        .from(urlsTable)
        .where(eq(urlsTable.shortCode, code))

    if (!result) {
        return Response.json({ error: 'Invalid short code' }, { status: 404 })
    }

    redirect(result.targetUrl)
}
