import { z } from 'zod'
import db from '@/lib/db'
import { usersTable } from '@/models/user'
import { hashPasswordWithSalt } from '@/lib/hash'
import { eq } from 'drizzle-orm'

const schema = z.object({
    firstname: z.string(),
    lastname:  z.string().optional(),
    email:     z.string().email(),
    password:  z.string().min(3),
})

export async function POST(request) {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
        return Response.json({ error: result.error.format() }, { status: 400 })
    }

    const { firstname, lastname, email, password } = result.data

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (existing) {
        return Response.json({ error: `User with ${email} already exists` }, { status: 409 })
    }

    const { salt, password: hashed } = hashPasswordWithSalt(password)

    const [user] = await db
        .insert(usersTable)
        .values({ firstname, lastname, email, password: hashed, salt })
        .returning({ id: usersTable.id })

    return Response.json({ message: 'User registered successfully', userId: user.id }, { status: 201 })
}
