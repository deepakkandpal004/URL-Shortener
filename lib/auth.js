import { verifyToken } from './token.js'

export function getUser(request) {
    const auth = request.headers.get('authorization') ?? ''
    if (!auth.startsWith('Bearer ')) return null
    const token = auth.slice(7)
    return verifyToken(token)
}

export function requireUser(request) {
    const user = getUser(request)
    if (!user?.id) {
        return { user: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { user, error: null }
}
