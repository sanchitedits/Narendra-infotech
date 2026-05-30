import React, { useState } from 'react';
import { AdminLayout, useAdminToast } from './AdminLayout';
import { ViewType, Product } from '../../types';
import { useData } from '../../DataContext';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

interface AdminProductsProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function AdminProducts({ currentView, setCurrentView }: AdminProductsProps) {
  const { products, categories, deleteProduct, refreshData, isLoading } = useData();
  const { showToast } = useAdminToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    categoryId: ''
  });

  const [filterCategory, setFilterCategory] = useState<string>('All Categories');

  const filteredProducts = products.filter(p => 
    (filterCategory === 'All Categories' || p.categoryId?.toString() === filterCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        showToast('Product deleted successfully');
      } else {
        showToast('Failed to delete product');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', description: '', image: '', categoryId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const cat = categories.find(c => c.name === product.category);
    setFormData({
      name: product.name,
      price: product.price,
      stock: String(product.stock || 0),
      description: product.description || '',
      image: product.image || '',
      categoryId: cat ? String(cat.id) : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        refreshData();
      } else {
        showToast(data.message || data.error || 'Failed to save product');
      }
    } catch (e) {
      console.error(e);
      showToast('An error occurred');
    }
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your storefront catalog.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select 
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-auto appearance-none border border-gray-200 bg-white text-sm rounded-md pl-4 pr-10 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer transition-colors hover:border-gray-300"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((c, idx) => (
                <option key={idx} value={c.id.toString()}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full relative">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full text-sm text-left">
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                          <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" }}  src={product.image || undefined} alt={product.name} className="w-full h-full object-cover mix-blend-multiply p-1" />
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
                        <button onClick={() => openEditModal(product)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
        </div>
        
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </span>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button 
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
               disabled={currentPage === 1}
               className="flex-1 sm:flex-none px-3 py-1 border border-gray-200 rounded hover:bg-blue-50 text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               Previous
            </button>
            <span className="px-3 py-1">{currentPage} / {totalPages || 1}</span>
            <button 
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
               disabled={currentPage === totalPages || totalPages === 0}
               className="flex-1 sm:flex-none px-3 py-1 border border-gray-200 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="">No Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"></textarea>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" form="productForm" className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
