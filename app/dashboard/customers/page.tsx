"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Eye,
  MoreHorizontal,
  UserCheck,
  Star,
  CreditCard,
  Wallet
} from "lucide-react";

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "vip";
  dateAdded: string;
  loyaltyPoints: number;
  creditBalance: number;
  avatar?: string;
}

// Mock data - in a real app, this would come from your database
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    totalOrders: 15,
    totalSpent: 1250.75,
    lastOrderDate: "2024-03-15",
    status: "vip",
    dateAdded: "2023-01-15",
    loyaltyPoints: 125,
    creditBalance: 50.00
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    totalOrders: 8,
    totalSpent: 645.20,
    lastOrderDate: "2024-03-10",
    status: "active",
    dateAdded: "2023-05-20",
    loyaltyPoints: 64,
    creditBalance: 25.50
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    totalOrders: 25,
    totalSpent: 2150.00,
    lastOrderDate: "2024-03-12",
    status: "vip",
    dateAdded: "2022-11-05",
    loyaltyPoints: 215,
    creditBalance: 100.00
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 321-0987",
    address: "321 Elm St",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    totalOrders: 3,
    totalSpent: 187.50,
    lastOrderDate: "2024-02-28",
    status: "active",
    dateAdded: "2024-01-10",
    loyaltyPoints: 18,
    creditBalance: 0.00
  },
  {
    id: "5",
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "+1 (555) 654-3210",
    address: "654 Maple Dr",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    totalOrders: 12,
    totalSpent: 890.25,
    lastOrderDate: "2024-01-15",
    status: "inactive",
    dateAdded: "2023-08-12",
    loyaltyPoints: 89,
    creditBalance: 15.75
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1 (555) 789-0123",
    address: "987 Cedar Ln",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    totalOrders: 7,
    totalSpent: 520.80,
    lastOrderDate: "2024-03-08",
    status: "active",
    dateAdded: "2023-12-01",
    loyaltyPoints: 52,
    creditBalance: 35.25
  }
];

const statusOptions = ["All", "Active", "Inactive", "VIP"];
const stateOptions = ["All", "NY", "CA", "IL", "FL", "WA", "MA"];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditOperation, setCreditOperation] = useState<"add" | "deduct">("add");

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "All" || customer.status === selectedStatus.toLowerCase();
    const matchesState = selectedState === "All" || customer.state === selectedState;
    return matchesSearch && matchesStatus && matchesState;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "vip":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vip":
        return <Star className="h-4 w-4" />;
      case "active":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleManageCredit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCreditModal(true);
  };

  const handleCreditSubmit = () => {
    if (!selectedCustomer || !creditAmount) return;
    
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setCustomers(prev => 
      prev.map(c => {
        if (c.id === selectedCustomer.id) {
          const newBalance = creditOperation === "add" 
            ? c.creditBalance + amount 
            : Math.max(0, c.creditBalance - amount);
          return { ...c, creditBalance: newBalance };
        }
        return c;
      })
    );
    
    setShowCreditModal(false);
    setSelectedCustomer(null);
    setCreditAmount("");
    setCreditOperation("add");
  };

  const handleBulkDelete = () => {
    if (selectedCustomers.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedCustomers.length} selected customers?`)) {
      setCustomers(prev => prev.filter(c => !selectedCustomers.includes(c.id)));
      setSelectedCustomers([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedCustomers.length === 0) return;
    
    const selectedData = customers.filter(c => selectedCustomers.includes(c.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Address,City,State,ZIP,Total Orders,Total Spent,Status\n" +
      selectedData.map(c => 
        `"${c.name}","${c.email}","${c.phone}","${c.address}","${c.city}","${c.state}","${c.zipCode}",${c.totalOrders},${c.totalSpent},"${c.status}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                ${customers.reduce((sum, c) => sum + c.creditBalance, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">VIP Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === "vip").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === "active" || c.status === "vip").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {stateOptions.map(state => (
              <option key={state} value={state}>{state === "All" ? "All States" : state}</option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Count</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All</option>
                  <option value="1-5">1-5 Orders</option>
                  <option value="6-15">6-15 Orders</option>
                  <option value="16+">16+ Orders</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spending Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000+">$1,000+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Order</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Time</option>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-indigo-800">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleBulkExport}
                className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 border border-indigo-300 rounded"
              >
                Export
              </button>
              <button 
                onClick={handleBulkDelete}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-indigo-600">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">Customer since {new Date(customer.dateAdded).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {customer.city}, {customer.state}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{customer.totalOrders}</div>
                    <div className="text-xs text-gray-500">
                      Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                    <div className="text-xs text-gray-500">
                      {customer.loyaltyPoints} points
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 text-orange-500 mr-1" />
                      <span className={customer.creditBalance > 0 ? "text-green-600" : "text-gray-500"}>
                        ${customer.creditBalance.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleManageCredit(customer)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                    >
                      Manage Credit
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusIcon(customer.status)}
                      <span className="ml-1">
                        {customer.status === "vip" ? "VIP" : customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(customer)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleManageCredit(customer)}
                        className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                        title="Manage Credit"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                <span className="font-medium">{filteredCustomers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add Customer Modal Forms */}
      {/* These would be similar to the product forms but for customer data */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Customer</h3>
            <p className="text-gray-600 mb-4">Customer form will be implemented here</p>
            <button 
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
              <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent}</p>
              <p><strong>Credit Balance:</strong> <span className={selectedCustomer.creditBalance > 0 ? "text-green-600" : "text-gray-500"}>${selectedCustomer.creditBalance.toFixed(2)}</span></p>
              <p><strong>Loyalty Points:</strong> {selectedCustomer.loyaltyPoints}</p>
            </div>
            <button 
              onClick={() => {setShowDetailsModal(false); setSelectedCustomer(null);}}
              className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Credit Management Modal */}
      {showCreditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Manage Credit - {selectedCustomer.name}</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Credit Balance</p>
              <p className="text-xl font-bold text-gray-900">${selectedCustomer.creditBalance.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="add"
                      checked={creditOperation === "add"}
                      onChange={(e) => setCreditOperation(e.target.value as "add" | "deduct")}
                      className="mr-2"
                    />
                    Add Credit
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="deduct"
                      checked={creditOperation === "deduct"}
                      onChange={(e) => setCreditOperation(e.target.value as "add" | "deduct")}
                      className="mr-2"
                    />
                    Deduct Credit
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreditSubmit}
                  disabled={!creditAmount || parseFloat(creditAmount) <= 0}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {creditOperation === "add" ? "Add Credit" : "Deduct Credit"}
                </button>
                <button
                  onClick={() => {
                    setShowCreditModal(false);
                    setSelectedCustomer(null);
                    setCreditAmount("");
                    setCreditOperation("add");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
