import { createHmac, randomBytes } from 'node:crypto'

export function hashPasswordWithSalt(password, userSalt = undefined) {
    const salt = userSalt ?? randomBytes(256).toString('hex')
    const password_hash = createHmac('sha256', salt).update(password).digest('hex')
    return { salt, password: password_hash }
}
