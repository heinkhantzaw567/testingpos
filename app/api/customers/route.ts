import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    // Get customers from Supabase
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch customers from database' },
        { status: 500 }
      );
    }

    // Transform database fields to match frontend expectations
    const transformedCustomers = customers.map(customer => ({
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
    }));

    // Apply search filter
    let filteredCustomers = transformedCustomers;
    
    if (search) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredCustomers,
      total: filteredCustomers.length,
      message: 'Customers fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers from database' },
      { status: 500 }
    );
  }
}

// POST - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone, address, city, creditBalance = 0 } = body;
    
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required fields' },
        { status: 400 }
      );
    }
    
    // Insert customer into Supabase
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address?.trim() || '',
        city: city?.trim() || '',
        credit_balance: parseFloat(creditBalance) || 0,
        total_orders: 0,
        total_spent: 0,
        loyalty_points: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create customer: ' + error.message },
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
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
