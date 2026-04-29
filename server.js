import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 5000)
const DB_PATH = join(__dirname, 'data', 'db.json')

const defaultData = {
  users: [],
  inquiries: [],
  properties: [
    {
      id: 1,
      name: 'Premium Residential Plots',
      location: 'Guntur Growth Corridor',
      price: 'Contact for pricing',
      category: 'Open Plots',
      status: 'Open',
    },
    {
      id: 2,
      name: 'Modern Family Homes',
      location: 'Residential neighborhoods',
      price: 'Budget friendly options',
      category: 'Homes',
      status: 'Featured',
    },
    {
      id: 3,
      name: 'Apartment Investments',
      location: 'Prime city access',
      price: 'Multiple ranges',
      category: 'Apartments',
      status: 'Available',
    },
  ],
}

async function readDb() {
  try {
    const raw = await readFile(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    await saveDb(defaultData)
    return structuredClone(defaultData)
  }
}

async function saveDb(data) {
  await mkdir(dirname(DB_PATH), { recursive: true })
  await writeFile(DB_PATH, `${JSON.stringify(data, null, 2)}\n`)
}

function hashPassword(password) {
  return createHash('sha256').update(String(password)).digest('hex')
}

function createToken() {
  return randomBytes(32).toString('base64url')
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function publicUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  }
}

const server = createServer(async (req, res) => {
  if (!req.url) return sendJson(res, 404, { success: false, message: 'Not found' })

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  const url = new URL(req.url, `http://${req.headers.host}`)

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, { success: true, status: 'Backend is running' })
    }

    if (req.method === 'GET' && url.pathname === '/api/properties') {
      const db = await readDb()
      return sendJson(res, 200, { success: true, properties: db.properties })
    }

    if (req.method === 'POST' && url.pathname === '/api/register') {
      const body = await readBody(req)
      const { firstName, lastName, email, password, phone = '' } = body

      if (!firstName || !lastName || !email || !password) {
        return sendJson(res, 400, { success: false, message: 'Please fill in all required fields' })
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return sendJson(res, 400, { success: false, message: 'Please enter a valid email' })
      }

      if (String(password).length < 6) {
        return sendJson(res, 400, { success: false, message: 'Password must be at least 6 characters' })
      }

      const db = await readDb()
      const normalizedEmail = String(email).toLowerCase()

      if (db.users.some((user) => user.email === normalizedEmail)) {
        return sendJson(res, 409, { success: false, message: 'An account already exists with this email' })
      }

      const user = {
        id: randomUUID(),
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      }

      db.users.push(user)
      await saveDb(db)

      return sendJson(res, 201, { success: true, token: createToken(), user: publicUser(user) })
    }

    if (req.method === 'POST' && url.pathname === '/api/login') {
      const { email, password } = await readBody(req)

      if (!email || !password) {
        return sendJson(res, 400, { success: false, message: 'Missing credentials' })
      }

      const db = await readDb()
      const user = db.users.find((item) => item.email === String(email).toLowerCase())

      if (!user || user.passwordHash !== hashPassword(password)) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password' })
      }

      return sendJson(res, 200, { success: true, token: createToken(), user: publicUser(user) })
    }

    if (req.method === 'POST' && url.pathname === '/api/inquiries') {
      const { name, phone, email = '', message = '', property = '' } = await readBody(req)

      if (!name || !phone) {
        return sendJson(res, 400, { success: false, message: 'Name and phone are required' })
      }

      const db = await readDb()
      const inquiry = {
        id: randomUUID(),
        name,
        phone,
        email,
        message,
        property,
        createdAt: new Date().toISOString(),
      }

      db.inquiries.push(inquiry)
      await saveDb(db)

      return sendJson(res, 201, { success: true, inquiry })
    }

    return sendJson(res, 404, { success: false, message: 'API route not found' })
  } catch (error) {
    console.error(error)
    return sendJson(res, 500, { success: false, message: 'Server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
  console.log('API endpoints: GET /api/health, GET /api/properties, POST /api/register, POST /api/login, POST /api/inquiries')
})
