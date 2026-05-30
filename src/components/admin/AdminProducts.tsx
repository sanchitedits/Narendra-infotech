import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { ViewType } from '../../types';
import { useData } from '../../DataContext';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface AdminProductsProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function AdminProducts({ currentView, setCurrentView }: AdminProductsProps) {
  const { products, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your storefront catalog.</p>
        </div>
        <button className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select className="w-full sm:w-auto appearance-none border border-gray-200 bg-white text-sm rounded-md pl-4 pr-10 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer transition-colors hover:border-gray-300">
              <option>All Categories</option>
              {categories.map((c, idx) => (
                <option key={idx}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 whitespace-nowrap">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply p-1" />
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{Number(product.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{product.stock || 0} in stock</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col divide-y divide-gray-200">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900">₹{Number(product.price).toLocaleString()}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 mt-1">
                  <span>{product.stock || 0} in stock</span>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No products found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
