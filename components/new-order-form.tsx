"use client";

import { useState } from "react";
import { 
  X, 
  Plus, 
  Minus, 
  User, 
  Package, 
  DollarSign,
  ShoppingCart,
  Trash2,
  Save
} from "lucide-react";
import { SimpleProduct } from "@/types/product";
import { SimpleCustomer } from "@/types/customer";
import { OrderItem, NewOrderFormProps } from "@/types/order";

// Mock data - in a real app, this would come from your database
const mockProducts: SimpleProduct[] = [
  { id: "1", name: "Wireless Headphones", price: 79.99, stock: 25, category: "Electronics" },
  { id: "2", name: "Phone Case", price: 24.99, stock: 50, category: "Accessories" },
  { id: "3", name: "Bluetooth Speaker", price: 125.00, stock: 15, category: "Electronics" },
  { id: "4", name: "USB Cable", price: 12.99, stock: 100, category: "Accessories" },
  { id: "5", name: "Laptop Stand", price: 45.50, stock: 30, category: "Office" },
  { id: "6", name: "Wireless Mouse", price: 35.99, stock: 40, category: "Computer" },
  { id: "7", name: "Keyboard", price: 89.99, stock: 20, category: "Computer" },
  { id: "8", name: "Monitor Stand", price: 42.99, stock: 18, category: "Office" }
];

const mockCustomers: SimpleCustomer[] = [
  { id: "1", name: "John Doe", email: "john.doe@email.com", phone: "+1 234-567-8901", address: "123 Main St, New York, NY 10001" },
  { id: "2", name: "Jane Smith", email: "jane.smith@email.com", phone: "+1 234-567-8902", address: "456 Oak Ave, Los Angeles, CA 90210" },
  { id: "3", name: "Mike Johnson", email: "mike.j@email.com", phone: "+1 234-567-8903", address: "789 Pine St, Chicago, IL 60601" },
  { id: "4", name: "Sarah Wilson", email: "sarah.w@email.com", phone: "+1 234-567-8904", address: "321 Elm St, Houston, TX 77001" },
  { id: "5", name: "David Brown", email: "david.brown@email.com", phone: "+1 234-567-8905", address: "654 Maple Dr, Phoenix, AZ 85001" }
];

export default function NewOrderForm({ isOpen, onClose, onSubmit }: NewOrderFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<SimpleCustomer | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<SimpleProduct | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  
  // Tax and Discount states
  const [taxRate, setTaxRate] = useState(8); // Default 8%
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountReason, setDiscountReason] = useState("");

  // Filter products based on search
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const selectProductToAdd = (product: SimpleProduct) => {
    setSelectedProductToAdd(product);
    setQuantityToAdd(1);
    setProductSearch(product.name);
    setShowProductList(false);
  };

  const addProductToOrder = () => {
    if (!selectedProductToAdd) return;
    
    const existingItem = orderItems.find(item => item.product.id === selectedProductToAdd.id);
    
    if (existingItem) {
      updateQuantity(selectedProductToAdd.id, existingItem.quantity + quantityToAdd);
    } else {
      const newItem: OrderItem = {
        product: selectedProductToAdd,
        quantity: quantityToAdd,
        subtotal: selectedProductToAdd.price * quantityToAdd
      };
      setOrderItems([...orderItems, newItem]);
    }
    
    // Reset selection
    setSelectedProductToAdd(null);
    setQuantityToAdd(1);
    setProductSearch("");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(productId);
      return;
    }

    setOrderItems(orderItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.product.price * newQuantity
        };
      }
      return item;
    }));
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateTotal();
    if (discountType === "percentage") {
      return subtotal * (discountValue / 100);
    } else {
      return Math.min(discountValue, subtotal); // Fixed discount can't exceed subtotal
    }
  };

  const calculateTotalAfterDiscount = () => {
    return calculateTotal() - calculateDiscount();
  };

  const calculateTax = () => {
    return calculateTotalAfterDiscount() * (taxRate / 100);
  };

  const calculateGrandTotal = () => {
    return calculateTotalAfterDiscount() + calculateTax();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    if (orderItems.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const orderData = {
      customer: selectedCustomer,
      items: orderItems,
      subtotal: calculateTotal(),
      discount: calculateDiscount(),
      discountType,
      discountValue,
      discountReason,
      taxRate,
      tax: calculateTax(),
      total: calculateGrandTotal(),
      paymentMethod,
      notes,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    onSubmit(orderData);
    
    // Reset form
    setSelectedCustomer(null);
    setOrderItems([]);
    setProductSearch("");
    setCustomerSearch("");
    setPaymentMethod("cash");
    setNotes("");
    setTaxRate(8);
    setDiscountType("percentage");
    setDiscountValue(0);
    setDiscountReason("");
    setSelectedProductToAdd(null);
    setQuantityToAdd(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            New Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer & Products */}
            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Select Customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerList(true);
                    }}
                    onFocus={() => setShowCustomerList(true)}
                  />
                  
                  {showCustomerList && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setCustomerSearch(customer.name);
                            setShowCustomerList(false);
                          }}
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email} • {customer.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedCustomer && (
                  <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-900">{selectedCustomer.name}</div>
                    <div className="text-sm text-indigo-700">{selectedCustomer.email}</div>
                    <div className="text-sm text-indigo-700">{selectedCustomer.phone}</div>
                  </div>
                )}
              </div>

              {/* Product Search & Add */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  Add Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductList(true);
                    }}
                    onFocus={() => setShowProductList(true)}
                  />
                  
                  {showProductList && productSearch && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectProductToAdd(product)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category} • Stock: {product.stock}</div>
                            </div>
                            <div className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Selected Product and Quantity */}
                {selectedProductToAdd && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-blue-900">{selectedProductToAdd.name}</div>
                        <div className="text-sm text-blue-700">${selectedProductToAdd.price.toFixed(2)} each • Stock: {selectedProductToAdd.stock}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductToAdd(null);
                          setQuantityToAdd(1);
                          setProductSearch("");
                        }}
                        className="text-blue-400 hover:text-blue-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-blue-900">Quantity:</label>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max={selectedProductToAdd.stock}
                            value={quantityToAdd}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                setQuantityToAdd(0); // Allow empty input temporarily
                                return;
                              }
                              const qty = parseInt(value);
                              if (!isNaN(qty) && qty >= 0 && qty <= selectedProductToAdd.stock) {
                                setQuantityToAdd(qty);
                              }
                            }}
                            onBlur={(e) => {
                              // If input is empty or 0 when losing focus, set to 1
                              const qty = parseInt(e.target.value) || 0;
                              if (qty < 1) {
                                setQuantityToAdd(1);
                              }
                            }}
                            onFocus={(e) => {
                              // Select all text when focusing for easy replacement
                              e.target.select();
                            }}
                            className="w-16 text-center font-medium text-blue-900 border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          
                          <button
                            type="button"
                            onClick={() => setQuantityToAdd(Math.min(selectedProductToAdd.stock, quantityToAdd + 1))}
                            disabled={quantityToAdd >= selectedProductToAdd.stock}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-700">Subtotal:</span>
                        <span className="font-bold text-blue-900">${(selectedProductToAdd.price * quantityToAdd).toFixed(2)}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={addProductToOrder}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="cash">Cash</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTaxRate(value === "" ? 0 : parseFloat(value) || 0);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="8.0"
                />
              </div>

              {/* Discount Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Value</label>
                    <input
                      type="number"
                      min="0"
                      max={discountType === "percentage" ? 100 : calculateTotal()}
                      step={discountType === "percentage" ? "0.1" : "0.01"}
                      value={discountValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDiscountValue(value === "" ? 0 : parseFloat(value) || 0);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={discountType === "percentage" ? "10" : "5.00"}
                    />
                  </div>
                </div>
                
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Discount reason (optional)"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Add any special instructions or notes..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No items added yet</p>
                  <p className="text-sm">Search and add products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.product.name}</div>
                          <div className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-gray-200 rounded text-center font-medium text-gray-900 min-w-[60px]">
                            {item.quantity}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeFromOrder(item.product.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="font-bold text-gray-900 ml-4 w-20 text-right">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Discount ({discountType === "percentage" ? `${discountValue}%` : `$${discountValue.toFixed(2)}`}):
                        </span>
                        <span className="font-medium">-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">After Discount:</span>
                        <span className="font-medium">${calculateTotalAfterDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({taxRate}%):</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>${calculateGrandTotal().toFixed(2)}</span>
                    </div>
                    
                    {discountReason && (
                      <div className="text-sm text-gray-500 italic mt-2">
                        Discount reason: {discountReason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
