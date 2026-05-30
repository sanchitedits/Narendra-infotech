import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types';

interface GlobalData {
  products: Product[];
  categories: any[];
}

const DataContext = createContext<GlobalData>({
  products: [],
  categories: [],
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GlobalData>({ products: [], categories: [] });

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ]).then(([prodData, catData]) => {
      setData({
        products: prodData.products || [],
        categories: catData.categories || []
      });
    }).catch(console.error);
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
