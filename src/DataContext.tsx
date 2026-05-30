import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types';

interface GlobalData {
  products: Product[];
  categories: any[];
  orders: any[];
  analytics: any;
  config: any;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  deleteProduct: (id: number) => Promise<boolean>;
}

const DataContext = createContext<GlobalData>({
  products: [],
  categories: [],
  orders: [],
  analytics: { stats: { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 }, recentOrders: [] },
  config: { database: false, resend: false, cashfree: false },
  isLoading: true,
  refreshData: async () => {},
  deleteProduct: async () => false,
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Omit<GlobalData, 'refreshData' | 'deleteProduct' | 'isLoading'>>({
    products: [],
    categories: [],
    orders: [],
    analytics: { stats: { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 }, recentOrders: [] },
    config: { database: false, resend: false, cashfree: false },
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [prodData, catData, ordData, analyticsData, configData] = await Promise.all([
        fetch('/api/products').then(res => res.json().catch(() => ({ products: [] }))),
        fetch('/api/categories').then(res => res.json().catch(() => ({ categories: [] }))),
        fetch('/api/orders').then(res => res.json().catch(() => ({ orders: [] }))),
        fetch('/api/analytics').then(res => res.json().catch(() => ({ stats: { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 }, recentOrders: [] }))),
        fetch('/api/config').then(res => res.json().catch(() => ({ config: { database: false, resend: false, cashfree: false } })))
      ]);
      setData({
        products: prodData.products || [],
        categories: catData.categories || [],
        orders: ordData.orders || [],
        analytics: {
          stats: analyticsData.stats || { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 },
          recentOrders: analyticsData.recentOrders || []
        },
        config: {
          database: configData.database || false,
          resend: configData.resend || false,
          cashfree: configData.cashfree || false,
        }
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return <DataContext.Provider value={{ ...data, isLoading, refreshData, deleteProduct }}>{children}</DataContext.Provider>;
};
