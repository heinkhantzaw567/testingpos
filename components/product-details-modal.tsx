"use client";

import { 
  X, 
  Package,
  DollarSign,
  Hash,
  Tag,
  User,
  Calendar,
  Image as ImageIcon,
  Eye,
  Archive,
  AlertTriangle
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  sku: string;
  status: "active" | "inactive" | "low-stock";
  dateAdded: string;
  supplier: string;
  image?: string;
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string, stock: number) => {
    if (stock === 0) return <Archive className="h-5 w-5" />;
    if (stock <= 10) return <AlertTriangle className="h-5 w-5" />;
    return <Package className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/3">
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-48">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                <div className="flex items-center mt-2">
                  {getStatusIcon(product.status, product.stock)}
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status === "low-stock" ? "Low Stock" : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Package className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Stock</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{product.stock} units</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Inventory Value</h4>
                <p className="text-2xl font-bold text-blue-900">
                  ${(product.price * product.stock).toFixed(2)}
                </p>
                <p className="text-sm text-blue-700">Total value in stock</p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Product Information</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Hash className="h-4 w-4 mr-1" />
                    SKU
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">{product.sku}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Tag className="h-4 w-4 mr-1" />
                    Category
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">{product.category}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 mr-1" />
                    Supplier
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">{product.supplier}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date Added
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded border">{formatDate(product.dateAdded)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Description</h4>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Stock Status</h5>
                <div className="space-y-2">
                  {product.stock === 0 && (
                    <div className="flex items-center text-red-600">
                      <Archive className="h-4 w-4 mr-2" />
                      <span className="text-sm">Out of stock - Needs restocking</span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Low stock - Consider reordering</span>
                    </div>
                  )}
                  {product.stock > 10 && (
                    <div className="flex items-center text-green-600">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="text-sm">In stock - Good inventory level</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
