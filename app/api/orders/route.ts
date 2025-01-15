import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'

async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  
  if (!token) return null

  try {
    const usersPath = path.join(process.cwd(), 'data', 'users.json')
    const usersData = await fs.readFile(usersPath, 'utf-8')
    const users = JSON.parse(usersData)
    
    return users.find((user: any) => user.token === token.value)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, subtotal, shipping, total } = body

    const order = {
      id: `ord_${Date.now()}`,
      userId: user.id,
      items,
      subtotal,
      shipping,
      total,
      status: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
    }

    const filePath = path.join(process.cwd(), 'data', 'orders.json')
    let orders = []

    try {
      const fileData = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(fileData)
    } catch (error) {
      orders = []
    }

    orders.push(order)
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2))

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filePath = path.join(process.cwd(), 'data', 'orders.json')
    let orders = []

    try {
      const fileData = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(fileData)
    } catch (error) {
      orders = []
    }

    const userOrders = orders.filter(order => order.userId === user.id)
    return NextResponse.json({ orders: userOrders })
  } catch (error) {
    console.error('Order API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 