export const authMiddleware = (req, res, next) => {
    try {
        if (req.user) {
            next()
        } else {
            res.status(401).json({ error: 'Request is not authorized' })
        }
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' })
    }
}
