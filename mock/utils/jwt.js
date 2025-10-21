import jwt from 'jsonwebtoken'

const secretKey = 'easy-admin-secret-key'
const algorithm = 'HS256'
const expiresIn = '24h'

export function generateToken(payload) {
  return jwt.sign(payload, secretKey, { algorithm, expiresIn })
}

export function verifyToken(token) {
  return jwt.verify(token, secretKey)
}

export default { generateToken, verifyToken }
