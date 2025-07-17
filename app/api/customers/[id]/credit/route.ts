import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerCredit } from '@/lib/database';
import { supabase } from '@/lib/database';

// POST - Add or deduct credit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount, operation } = body;
    
    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount provided' },
        { status: 400 }
      );
    }
    
    if (!operation || !['add', 'deduct'].includes(operation)) {
      return NextResponse.json(
        { success: false, error: 'Invalid operation. Use "add" or "deduct"' },
        { status: 400 }
      );
    }
    
    // Update customer credit
    const updatedCustomer = await updateCustomerCredit(params.id, amount, operation);
    
    // Log the credit transaction
    await supabase.from('credit_transactions').insert({
      customer_id: params.id,
      amount: operation === 'add' ? amount : -amount,
      operation: operation,
      description: `Credit ${operation === 'add' ? 'added' : 'deducted'} manually`
    });

    // Transform to frontend format
    const transformedCustomer = {
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      address: updatedCustomer.address || '',
      city: updatedCustomer.city || '',
      zipCode: updatedCustomer.zip_code || '',
      status: updatedCustomer.status,
      totalOrders: updatedCustomer.total_orders || 0,
      totalSpent: updatedCustomer.total_spent || 0,
      creditBalance: updatedCustomer.credit_balance || 0,
      loyaltyPoints: updatedCustomer.loyalty_points || 0,
      lastOrderDate: updatedCustomer.last_order_date,
      dateAdded: updatedCustomer.created_at,
    };
    
    return NextResponse.json({
      success: true,
      data: transformedCustomer,
      message: `Credit ${operation === 'add' ? 'added' : 'deducted'} successfully`
    });
  } catch (error) {
    console.error('Error managing credit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage credit' },
      { status: 500 }
    );
  }
}
