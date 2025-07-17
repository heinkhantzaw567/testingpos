import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Transform database fields to match frontend expectations
    const transformedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      totalOrders: customer.total_orders || 0,
      totalSpent: customer.total_spent || 0,
      creditBalance: customer.credit_balance || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      lastOrderDate: customer.last_order_date,
      dateAdded: customer.created_at,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    };
    
    return NextResponse.json({
      success: true,
      data: transformedCustomer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, creditBalance } = body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required fields' },
        { status: 400 }
      );
    }
    
    // Update customer in Supabase
    const { data: customer, error } = await supabase
      .from('customers')
      .update({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address?.trim() || '',
        city: city?.trim() || '',
        credit_balance: parseFloat(creditBalance) || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update customer: ' + error.message },
        { status: 500 }
      );
    }

    // Transform back to frontend format
    const transformedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      totalOrders: customer.total_orders || 0,
      totalSpent: customer.total_spent || 0,
      creditBalance: customer.credit_balance || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      lastOrderDate: customer.last_order_date,
      dateAdded: customer.created_at,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    };
    
    return NextResponse.json({
      success: true,
      data: transformedCustomer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete customer: ' + error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
