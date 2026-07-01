import { z } from 'zod'
import db from '@/lib/db'
import { usersTable } from '@/models/user'
import { hashPasswordWithSalt } from '@/lib/hash'
import { signToken } from '@/lib/token'
import { eq } from 'drizzle-orm'

const schema = z.object({
    email:    z.string().email(),
    password: z.string().min(3),
})

export async function POST(request) {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
        return Response.json({ error: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (!user) {
        return Response.json({ error: `No user found with email ${email}` }, { status: 401 })
    }

    const { password: hashed } = hashPasswordWithSalt(password, user.salt)
    if (user.password !== hashed) {
        return Response.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const token = signToken({ id: user.id })
    return Response.json({ message: 'Logged in successfully', token, userId: user.id })
}
