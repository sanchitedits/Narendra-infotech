export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  vendor?: string;
  category: string;
  categoryId?: number;
  rating: number;
  image: string;
  description?: string;
  specifications?: Record<string, string>;
  inTheBox?: string[];
  variants?: string[];
  tags?: string | string[];
  stock?: number;
  status?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  name: string;
  count: string;
}

export type ViewType = 'home' | 'product' | 'category' | 'cart' | 'checkout' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | 'admin-dashboard' | 'admin-products' | 'admin-orders';
