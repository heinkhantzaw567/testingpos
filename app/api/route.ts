import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'POS API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      customers: {
        'GET /api/customers': 'Fetch all customers',
        'POST /api/customers': 'Create a new customer',
        'GET /api/customers/[id]': 'Fetch specific customer',
        'PUT /api/customers/[id]': 'Update customer',
        'DELETE /api/customers/[id]': 'Delete customer',
        'POST /api/customers/[id]/credit': 'Manage customer credit'
      },
      products: {
        'GET /api/products': 'Fetch all products',
        'POST /api/products': 'Create a new product'
      },
      orders: {
        'GET /api/orders': 'Fetch all orders',
        'POST /api/orders': 'Create a new order'
      }
    }
  });
}
