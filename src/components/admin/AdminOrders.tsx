import { useState } from 'react';
import { AdminLayout, useAdminToast } from './AdminLayout';
import { ViewType } from '../../types';
import { Search, MoreHorizontal, X, Package } from 'lucide-react';
import { useData } from '../../DataContext';

interface AdminOrdersProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function AdminOrders({ currentView, setCurrentView }: AdminOrdersProps) {
  const { showToast } = useAdminToast();
  const { orders, isLoading: isLoadingOrders, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !statusUpdate || statusUpdate === selectedOrder.status) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusUpdate }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order status updated');
        await refreshData();
        setSelectedOrder({ ...selectedOrder, status: statusUpdate });
      } else {
        showToast(data.message || 'Update failed');
      }
    } catch (e) {
      showToast('Error updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order deleted');
        await refreshData();
        closeOrderDetails();
      } else {
        showToast(data.message || 'Delete failed');
      }
    } catch (e) {
      showToast('Error deleting order');
    }
  };

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(o => 
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.firstName && o.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.lastName && o.lastName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status || 'pending');
    setIsLoadingItems(true);
    setOrderItems([]);
    try {
      const res = await fetch(`/api/orders/${order.id}/items`);
      const data = await res.json();
      if (data.success) {
        setOrderItems(data.items);
      } else {
        showToast('Failed to load items');
      }
    } catch (e) {
      console.error(e);
      showToast('Error loading items');
    } finally {
      setIsLoadingItems(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const currentOrderItems = selectedOrder ? orderItems : [];

const handleRefund = async () => {
    if (!selectedOrder) return;
    
    if (selectedOrder.status === 'refunded') {
      showToast('Order is already refunded');
      return;
    }
    
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'refunded' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order refunded successfully');
        await refreshData();
        setSelectedOrder({ ...selectedOrder, status: 'refunded' });
      } else {
        showToast(data.message || 'Refund failed');
      }
    } catch (e) {
      console.error(e);
      showToast('Error processing refund');
    }
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage customer orders.</p>
        </div>
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," 
              + "Order Number,First Name,Last Name,Email,Total,Status,Date\n"
              + filteredOrders.map(o => `${o.orderNumber},${o.firstName || ''},${o.lastName || ''},${o.email || ''},${o.total},${o.status},${new Date(o.createdAt).toLocaleDateString()}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "orders.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Export successful');
          }}
          className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-200 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="flex items-center justify-center w-full sm:w-auto gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none transition-colors">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full relative">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full text-sm text-left">
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
              {isLoadingOrders ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} onClick={() => handleViewOrder(order)} className="hover:bg-gray-50 transition-colors cursor-pointer">
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
                    <td className="px-6 py-4 text-gray-500 cursor-pointer hover:text-blue-600" onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}>View items</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }} className="text-gray-400 hover:text-gray-900 transition-colors">
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
        </div>
        
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order {selectedOrder.orderNumber}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={closeOrderDetails} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-3">Customer Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrder.email}</p>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-3">Order Status</h4>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="mt-2 text-right">
                  <button 
                     onClick={handleUpdateStatus} 
                     disabled={isUpdatingStatus || statusUpdate === selectedOrder.status}
                     className="text-sm text-blue-600 font-medium hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                     {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-3">Items ({currentOrderItems.length})</h4>
                {isLoadingItems ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrderItems.map(item => (
                      <div key={item.id} className="flex gap-4 items-center border border-gray-100 rounded-lg p-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.productImage ? (
                            <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image" }}  src={item.productImage} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply p-1" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.productName}</p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">₹{Number(item.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {currentOrderItems.length === 0 && (
                       <p className="text-sm text-gray-500 italic text-center py-4">No items found for this order.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-500">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{Number(selectedOrder.total).toLocaleString()}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleDeleteOrder} 
                  className="flex-1 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium py-2 rounded-lg transition-colors">
                  Delete Order
                </button>
                <button 
                  onClick={handleRefund} 
                  disabled={selectedOrder.status === 'refunded'}
                  className="flex-1 border border-gray-200 text-gray-900 bg-white hover:bg-gray-50 disabled:opacity-50 font-medium py-2 rounded-lg transition-colors">
                  {selectedOrder.status === 'refunded' ? 'Refunded' : 'Issue Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
