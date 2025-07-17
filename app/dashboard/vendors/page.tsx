"use client";

import { useState } from "react";
import AddVendorForm from "@/components/add-vendor-form";
import EditVendorForm from "@/components/edit-vendor-form";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Building2,
  DollarSign,
  Users,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  AlertTriangle,
  MoreHorizontal,
  User,
  X
} from "lucide-react";
import { Vendor, VendorFormData } from "@/types/vendor";

// Mock vendors data - in a real app, this would come from your database
const mockVendors: Vendor[] = [
  {
    id: "VND-001",
    name: "TechCorp Supplies",
    company: "TechCorp Inc.",
    email: "sales@techcorp.com",
    phone: "+1 234-567-8901",
    address: "123 Tech Street",
    city: "San Francisco",
    zipCode: "94105",
    country: "United States",
    website: "https://techcorp.com",
    contactPerson: "John Smith",
    paymentTerms: "Net 30",
    status: "active",
    rating: 5,
    totalOrders: 45,
    totalPurchases: 125000.50,
    lastOrderDate: "2025-01-10",
    dateAdded: "2024-01-15",
    notes: "Primary supplier for electronics",
    taxId: "12-3456789",
    currency: "USD",
    leadTime: 7
  },
  {
    id: "VND-002",
    name: "Office Pro",
    company: "Office Pro Ltd.",
    email: "contact@officepro.com",
    phone: "+1 234-567-8902",
    address: "456 Business Ave",
    city: "New York",
    zipCode: "10001",
    country: "United States",
    website: "https://officepro.com",
    contactPerson: "Sarah Johnson",
    paymentTerms: "Net 60",
    status: "active",
    rating: 4,
    totalOrders: 32,
    totalPurchases: 89750.25,
    lastOrderDate: "2025-01-08",
    dateAdded: "2024-02-20",
    notes: "Reliable office supplies vendor",
    taxId: "98-7654321",
    currency: "USD",
    leadTime: 5
  },
  {
    id: "VND-003",
    name: "Global Accessories",
    company: "Global Accessories Inc.",
    email: "orders@globalacc.com",
    phone: "+1 234-567-8903",
    address: "789 Import Lane",
    city: "Los Angeles",
    zipCode: "90210",
    country: "United States",
    website: "https://globalacc.com",
    contactPerson: "Mike Chen",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4,
    totalOrders: 28,
    totalPurchases: 67300.75,
    lastOrderDate: "2025-01-12",
    dateAdded: "2024-03-10",
    notes: "Good quality accessories supplier",
    taxId: "45-6789123",
    currency: "USD",
    leadTime: 10
  },
  {
    id: "VND-004",
    name: "Quick Parts",
    company: "Quick Parts Co.",
    email: "support@quickparts.com",
    phone: "+1 234-567-8904",
    address: "321 Rapid Rd",
    city: "Chicago",
    zipCode: "60601",
    country: "United States",
    website: "https://quickparts.com",
    contactPerson: "Lisa Wang",
    paymentTerms: "COD",
    status: "inactive",
    rating: 3,
    totalOrders: 15,
    totalPurchases: 34500.00,
    lastOrderDate: "2024-12-20",
    dateAdded: "2024-04-15",
    notes: "Fast delivery but higher prices",
    taxId: "78-9123456",
    currency: "USD",
    leadTime: 3
  },
  {
    id: "VND-005",
    name: "Budget Supplies",
    company: "Budget Supplies LLC",
    email: "info@budgetsupplies.com",
    phone: "+1 234-567-8905",
    address: "654 Economy St",
    city: "Houston",
    zipCode: "77001",
    country: "United States",
    contactPerson: "Robert Davis",
    paymentTerms: "Prepaid",
    status: "suspended",
    rating: 2,
    totalOrders: 8,
    totalPurchases: 12400.50,
    lastOrderDate: "2024-11-15",
    dateAdded: "2024-05-01",
    notes: "Payment issues - suspended",
    taxId: "56-7891234",
    currency: "USD",
    leadTime: 14
  }
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <div className="h-2 w-2 bg-green-500 rounded-full"></div>;
      case "inactive":
        return <div className="h-2 w-2 bg-gray-500 rounded-full"></div>;
      case "suspended":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-2 w-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVendors.length === filteredVendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(filteredVendors.map(v => v.id));
    }
  };

  const handleAddVendor = (vendorData: VendorFormData) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
      totalOrders: 0,
      totalPurchases: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setVendors(prev => [...prev, newVendor]);
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowEditForm(true);
  };

  const handleUpdateVendor = (vendorData: VendorFormData) => {
    if (!selectedVendor) return;
    
    const updatedVendor: Vendor = {
      ...selectedVendor,
      ...vendorData
    };
    
    setVendors(prev => prev.map(v => 
      v.id === selectedVendor.id ? updatedVendor : v
    ));
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVendor) return;
    
    setIsDeleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setVendors(prev => prev.filter(v => v.id !== selectedVendor.id));
    setShowDeleteModal(false);
    setSelectedVendor(null);
    setIsDeleting(false);
  };

  const handleBulkDelete = () => {
    if (selectedVendors.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedVendors.length} selected vendors?`)) {
      setVendors(prev => prev.filter(v => !selectedVendors.includes(v.id)));
      setSelectedVendors([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedVendors.length === 0) return;
    
    const selectedData = vendors.filter(v => selectedVendors.includes(v.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Company,Email,Phone,Contact Person,Status,Rating,Total Orders,Total Purchases\n" +
      selectedData.map(v => 
        `"${v.name}","${v.company}","${v.email}","${v.phone}","${v.contactPerson}","${v.status}",${v.rating},${v.totalOrders},${v.totalPurchases}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalValue = () => {
    return vendors.reduce((sum, vendor) => sum + vendor.totalPurchases, 0);
  };

  const getActiveVendorsCount = () => {
    return vendors.filter(vendor => vendor.status === "active").length;
  };

  const getAverageRating = () => {
    const totalRating = vendors.reduce((sum, vendor) => sum + vendor.rating, 0);
    return totalRating / vendors.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage your suppliers and vendor relationships</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${getTotalValue().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">
                {getActiveVendorsCount()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageRating().toFixed(1)}
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
              placeholder="Search vendors by name, company, email, or contact person..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {/* Export */}
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Terms</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="COD">COD</option>
                  <option value="Prepaid">Prepaid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Lead Times</option>
                  <option value="1-3">1-3 days</option>
                  <option value="4-7">4-7 days</option>
                  <option value="8-14">8-14 days</option>
                  <option value="15+">15+ days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-indigo-800">
                {selectedVendors.length} vendor{selectedVendors.length > 1 ? 's' : ''} selected
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

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
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
                  Total Purchases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
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
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        {vendor.contactPerson}
                      </div>
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        {vendor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {vendor.city}, {vendor.country}
                      </div>
                      {vendor.website && (
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 text-gray-400 mr-1" />
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{vendor.totalOrders}</div>
                    <div className="text-xs text-gray-500">
                      Last: {vendor.lastOrderDate ? new Date(vendor.lastOrderDate).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${vendor.totalPurchases.toLocaleString()}
                    <div className="text-xs text-gray-500">
                      {vendor.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {renderStarRating(vendor.rating)}
                    <div className="text-xs text-gray-500 mt-1">
                      {vendor.rating}/5
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                      {getStatusIcon(vendor.status)}
                      <span className="ml-1">
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(vendor)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditVendor(vendor)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                        title="Edit Vendor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteVendor(vendor)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete Vendor"
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
        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVendors.length > 0 && (
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVendors.length}</span> of{' '}
                <span className="font-medium">{filteredVendors.length}</span> results
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

      {/* Add Vendor Form */}
      <AddVendorForm 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddVendor}
      />

      {/* Edit Vendor Form */}
      <EditVendorForm 
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedVendor(null);
        }}
        onSubmit={handleUpdateVendor}
        vendor={selectedVendor}
      />

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
                <button
                  onClick={() => {setShowDetailsModal(false); setSelectedVendor(null);}}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                      <p className="text-gray-900">{selectedVendor.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900">{selectedVendor.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-gray-900">{selectedVendor.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rating</label>
                      <div className="flex items-center space-x-2">
                        {renderStarRating(selectedVendor.rating)}
                        <span className="text-gray-600">({selectedVendor.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedVendor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedVendor.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{selectedVendor.address}</p>
                      <p className="text-gray-900">{selectedVendor.city}, {selectedVendor.zipCode}</p>
                      <p className="text-gray-900">{selectedVendor.country}</p>
                    </div>
                    {selectedVendor.website && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                          {selectedVendor.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                      <p className="text-gray-900">{selectedVendor.paymentTerms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Currency</label>
                      <p className="text-gray-900">{selectedVendor.currency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Lead Time</label>
                      <p className="text-gray-900">{selectedVendor.leadTime} days</p>
                    </div>
                    {selectedVendor.taxId && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tax ID</label>
                        <p className="text-gray-900">{selectedVendor.taxId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Orders</label>
                      <p className="text-gray-900">{selectedVendor.totalOrders}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Purchases</label>
                      <p className="text-gray-900">${selectedVendor.totalPurchases.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Order Date</label>
                      <p className="text-gray-900">
                        {selectedVendor.lastOrderDate ? new Date(selectedVendor.lastOrderDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedVendor.status)}`}>
                        {getStatusIcon(selectedVendor.status)}
                        <span className="ml-1">
                          {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedVendor.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVendor.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => {setShowDetailsModal(false); setSelectedVendor(null);}}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditVendor(selectedVendor);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Vendor</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedVendor.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => {setShowDeleteModal(false); setSelectedVendor(null);}}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
