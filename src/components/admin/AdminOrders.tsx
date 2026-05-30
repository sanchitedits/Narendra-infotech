import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { ViewType } from '../../types';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

interface AdminOrdersProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function AdminOrders({ currentView, setCurrentView }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
          if (data.orders) setOrders(data.orders);
      })
      .catch(console.error);
  }, []);

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.firstName && o.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.lastName && o.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage customer orders.</p>
        </div>
        <button className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-200 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>
          <button className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 whitespace-nowrap">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{Number(order.total).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' || order.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">View items</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col divide-y divide-gray-200">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{order.orderNumber}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'processing' || order.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status || 'unknown'}
                  </span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">₹{Number(order.total).toLocaleString()}</span>
                    <p className="text-xs text-gray-500">View items</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 mt-1">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <button className="text-blue-600 font-medium">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No orders found matching "{searchTerm}".
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="text-center sm:text-left">Showing 1 to {filteredOrders.length} of {orders.length} results</span>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button className="flex-1 sm:flex-none px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Previous</button>
            <button className="flex-1 sm:flex-none px-3 py-1 border border-gray-200 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-900">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
