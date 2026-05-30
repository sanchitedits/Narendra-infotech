import React, { useState } from 'react';
import { AdminLayout, useAdminToast } from './AdminLayout';
import { ViewType } from '../../types';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Database, Zap, Mail, Loader2, CheckCircle2, XCircle, Upload } from 'lucide-react';
import { useData } from '../../DataContext';

interface AdminDashboardProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function AdminDashboard({ currentView, setCurrentView }: AdminDashboardProps) {
  const { showToast } = useAdminToast();
  const { analytics, config, isLoading: isLoadingAnalytics, refreshData } = useData();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedMessage(data.message);
      if (data.success) {
        await refreshData();
      }
    } catch (e) {
      setSeedMessage('Failed to seed database.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
       try {
          const text = event.target?.result;
          const res = await fetch('/api/import-csv', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ csvText: text })
          });
          const data = await res.json();
          if (data.success) {
             setImportMessage({ type: 'success', text: data.message });
             await refreshData();
          } else {
             setImportMessage({ type: 'error', text: data.error || 'Import failed.' });
          }
       } catch (err) {
          setImportMessage({ type: 'error', text: 'Upload error.' });
       } finally {
          setIsImporting(false);
          e.target.value = ''; // Reset input
       }
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select className="w-full sm:w-auto appearance-none border border-gray-200 bg-white text-sm rounded-md pl-4 pr-10 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer transition-colors hover:border-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
              <option>This year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <button 
            onClick={() => {
               const csvHeader = "Metric,Value\n";
               const csvData = [
                 `Total Revenue,${analytics.stats.totalRevenue}`,
                 `Total Orders,${analytics.stats.totalOrders}`,
                 `Active Customers,${analytics.stats.activeCustomers}`
               ].join("\n");
               
               const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvHeader + csvData);
               const link = document.createElement("a");
               link.setAttribute("href", encodedUri);
               link.setAttribute("download", "dashboard_report.csv");
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               showToast('Report downloaded');
            }}
            className="w-full sm:w-auto whitespace-nowrap bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors active:scale-[0.98]">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoadingAnalytics ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-md border border-gray-200 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="w-9 h-9 bg-gray-200 rounded-md"></div>
                <div className="w-12 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          [
            { name: 'Total Revenue', value: `₹${Number(analytics.stats.totalRevenue).toLocaleString()}`, change: '+0.0%', trend: 'up', icon: DollarSign },
            { name: 'Total Orders', value: analytics.stats.totalOrders.toString(), change: '+0.0%', trend: 'up', icon: ShoppingBag },
            { name: 'Active Customers', value: analytics.stats.activeCustomers.toString(), change: '+0.0%', trend: 'up', icon: Users },
            { name: 'Conversion Rate', value: '3.4%', change: '+0.0%', trend: 'up', icon: TrendingUp }, // Currently mocked
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-6 rounded-md border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-md border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">System Integrations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border flex flex-col gap-2 ${config.database ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
               <div className="flex items-center gap-2">
                 <Database className={`w-5 h-5 ${config.database ? 'text-green-600' : 'text-gray-400'}`} />
                 <span className="font-medium text-gray-900 text-sm">Postgres DB</span>
               </div>
               <div className="flex items-center gap-1 mt-auto">
                 {config.database ? (
                   <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-xs font-medium text-green-700">Connected</span></>
                 ) : (
                   <><XCircle className="w-4 h-4 text-gray-400" /><span className="text-xs font-medium text-gray-500">Missing</span></>
                 )}
               </div>
            </div>
            
            <div className={`p-4 rounded-lg border flex flex-col gap-2 ${config.cashfree ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
               <div className="flex items-center gap-2">
                 <Zap className={`w-5 h-5 ${config.cashfree ? 'text-green-600' : 'text-gray-400'}`} />
                 <span className="font-medium text-gray-900 text-sm">Cashfree Payments</span>
               </div>
               <div className="flex items-center gap-1 mt-auto">
                 {config.cashfree ? (
                   <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-xs font-medium text-green-700">Connected</span></>
                 ) : (
                   <><XCircle className="w-4 h-4 text-gray-400" /><span className="text-xs font-medium text-gray-500">Missing</span></>
                 )}
               </div>
            </div>
            
            <div className={`p-4 rounded-lg border flex flex-col gap-2 ${config.resend ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
               <div className="flex items-center gap-2">
                 <Mail className={`w-5 h-5 ${config.resend ? 'text-green-600' : 'text-gray-400'}`} />
                 <span className="font-medium text-gray-900 text-sm">Resend Email</span>
               </div>
               <div className="flex items-center gap-1 mt-auto">
                 {config.resend ? (
                   <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-xs font-medium text-green-700">Connected</span></>
                 ) : (
                   <><XCircle className="w-4 h-4 text-gray-400" /><span className="text-xs font-medium text-gray-500">Missing</span></>
                 )}
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-white rounded-md border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-gray-900 mb-2">Seed Database</h3>
              <p className="text-sm text-gray-500 mb-6">Populate connected database with default products and categories.</p>
              <button 
                  onClick={handleSeedDatabase}
                  disabled={!config.database || isSeeding}
                  className="w-full bg-gray-900 text-white rounded text-sm font-medium py-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                  {isSeeding ? <><Loader2 className="w-4 h-4 animate-spin"/> Seeding...</> : 'Run Seed Script'}
              </button>
              {seedMessage && (
                  <p className="text-xs mt-3 font-medium text-gray-600">{seedMessage}</p>
              )}
          </div>
          
          <div className="bg-white rounded-md border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-gray-900 mb-2">Import Products</h3>
              <p className="text-sm text-gray-500 mb-6">Upload a Shopify or WooCommerce CSV to bulk import products.</p>
              <div className="w-full relative">
                  <input 
                     type="file" 
                     accept=".csv"
                     onChange={handleFileUpload}
                     disabled={!config.database || isImporting}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                  />
                  <button 
                      disabled={!config.database || isImporting}
                      className="w-full bg-blue-600 text-white rounded text-sm font-medium py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-0"
                  >
                      {isImporting ? <><Loader2 className="w-4 h-4 animate-spin"/> Importing...</> : <><Upload className="w-4 h-4"/> Select CSV</>}
                  </button>
              </div>
              {importMessage && (
                  <p className={`text-xs mt-3 font-medium ${importMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{importMessage.text}</p>
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setCurrentView('admin-orders')}>View All</button>
          </div>
          <div className="overflow-x-auto w-full relative">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium whitespace-nowrap">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                {isLoadingAnalytics ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded-full w-20"></div></td>
                        <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : analytics.recentOrders.length > 0 ? analytics.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{order.firstName} {order.lastName}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">₹{Number(order.total).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' || order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setCurrentView('admin-orders')} className="text-gray-400 hover:text-gray-900">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                    </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
          {/* Placeholder for a chart or secondary widget */}
          <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6 relative">
             <div className="absolute -inset-2 rounded-full border-8 border-blue-600 border-t-transparent border-r-transparent transform rotate-45"></div>
             <span className="text-2xl font-bold text-gray-900">75%</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Sales Target</h3>
          <p className="text-sm text-gray-500 mb-6">You've reached 75% of your sales goal for this month.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
